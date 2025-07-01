import { supabase } from './api.service';
import type { Job, JobStatus, QualityCheck } from '../types';

export const jobsService = {
  /**
   * Fetch all jobs
   */
  async fetchJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          operations:job_operations(*),
          materials:job_materials(*),
          drawings:job_drawings(*),
          quality_requirements:quality_requirements(*),
          history:job_history(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the data to match the expected Job type
      return (data || []).map(job => ({
        id: job.id,
        jobNumber: job.job_number,
        partNumber: job.part_number,
        partName: job.part_name,
        customer: job.customer,
        quantity: job.quantity,
        completedQuantity: job.completed_quantity,
        status: job.status,
        priority: job.priority,
        dueDate: job.due_date,
        startDate: job.start_date,
        estimatedHours: job.estimated_hours,
        actualHours: job.actual_hours,
        operator: job.operator_id, // Would need to join with users table for name
        machine: job.machine_id, // Would need to join with machines table for name
        operation: job.operation || '',
        notes: job.notes || '',
        operations: job.operations || [],
        dncPrograms: [], // Would need to fetch separately
        history: job.history || [],
        qualityRequirements: job.quality_requirements || [],
        tooling: [], // Would need to fetch separately
        materials: job.materials || [],
        drawings: job.drawings || [],
        createdAt: job.created_at,
        updatedAt: job.updated_at
      }));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      return [];
    }
  },

  /**
   * Get a job by ID
   */
  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          operations:job_operations(*),
          materials:job_materials(*),
          drawings:job_drawings(*),
          quality_requirements:quality_requirements(*),
          history:job_history(*)
        `)
        .eq('id', jobId)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Fetch DNC programs for this job
      const { data: dncPrograms, error: dncError } = await supabase
        .from('dnc_programs')
        .select('*')
        .eq('operation_id', data.operations.map((op: any) => op.id));
      
      if (dncError) console.error('Error fetching DNC programs:', dncError);
      
      return {
        id: data.id,
        jobNumber: data.job_number,
        partNumber: data.part_number,
        partName: data.part_name,
        customer: data.customer,
        quantity: data.quantity,
        completedQuantity: data.completed_quantity,
        status: data.status,
        priority: data.priority,
        dueDate: data.due_date,
        startDate: data.start_date,
        estimatedHours: data.estimated_hours,
        actualHours: data.actual_hours,
        operator: data.operator_id, // Would need to join with users table for name
        machine: data.machine_id, // Would need to join with machines table for name
        operation: data.operation || '',
        notes: data.notes || '',
        operations: data.operations || [],
        dncPrograms: dncPrograms || [],
        history: data.history || [],
        qualityRequirements: data.quality_requirements || [],
        tooling: [], // Would need to fetch separately
        materials: data.materials || [],
        drawings: data.drawings || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (err) {
      console.error('Error fetching job by ID:', err);
      return null;
    }
  },

  /**
   * Update job status
   */
  async updateJobStatus(jobId: string, status: JobStatus, notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          status,
          notes: notes ? notes : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating job status:', err);
      return false;
    }
  },

  /**
   * Update job progress (completed quantity)
   */
  async updateJobProgress(jobId: string, completedQuantity: number): Promise<boolean> {
    try {
      const { data: job, error: fetchError } = await supabase
        .from('jobs')
        .select('quantity')
        .eq('id', jobId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Ensure completed quantity doesn't exceed total quantity
      const validQuantity = Math.min(completedQuantity, job.quantity);
      
      // Update the job
      const { error } = await supabase
        .from('jobs')
        .update({
          completed_quantity: validQuantity,
          status: validQuantity === job.quantity ? 'completed' : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating job progress:', err);
      return false;
    }
  },

  /**
   * Update operation status
   */
  async updateOperationStatus(operationId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_operations')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', operationId);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error('Error updating operation status:', err);
      return false;
    }
  },

  /**
   * Add quality check
   */
  async addQualityCheck(check: Omit<QualityCheck, 'id'>): Promise<QualityCheck | null> {
    try {
      const { data, error } = await supabase
        .from('quality_checks')
        .insert({
          requirement_id: check.requirementId,
          // operation_id: check.operationId, // Removed, not present in QualityCheck
          inspector_id: check.inspector,
          inspector_name: check.inspector,
          result: check.result,
          actual_value: check.actualValue,
          notes: check.notes,
          images: check.images
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        requirementId: data.requirement_id,
        // operationId: data.operation_id, // Removed, not present in QualityCheck
        timestamp: data.timestamp,
        inspector: data.inspector_name,
        result: data.result,
        actualValue: data.actual_value,
        notes: data.notes,
        images: data.images
      };
    } catch (err) {
      console.error('Error adding quality check:', err);
      return null;
    }
  }
};