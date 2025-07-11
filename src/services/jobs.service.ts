import { supabase } from './api.service';
import type { JobStatus, QualityCheck } from '../types';
import type { Job as CanonicalJob } from '../types/index';
import type { Job as ValidationJob } from '../types/job';
import { validateJob } from '../utils/validate.utils';
import { canAccess } from '../utils/security.utils';
import { logAudit, logConsistencyFlag } from './api.service';

export const jobsService = {
  /**
   * Fetch all jobs
   */
  async fetchJobs(): Promise<CanonicalJob[]> {
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
      
      // Process the data to match the expected Job type (from src/types/index.ts)
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
        operator: job.operator_id,
        machine: job.machine_id,
        operation: job.operation || '',
        notes: job.notes || '',
        operations: job.operations || [],
        dncPrograms: [], // Would need to fetch separately
        history: job.history || [],
        qualityRequirements: job.quality_requirements || [],
        tooling: [], // Would need to fetch separately
        materials: job.materials || [],
        drawings: job.drawings || [],
        aiRecommendation: job.ai_recommendation || undefined,
        createdAt: job.created_at,
        updatedAt: job.updated_at
      } as CanonicalJob));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      return [];
    }
  },

  /**
   * Get a job by ID
   */
  async getJobById(jobId: string): Promise<CanonicalJob | null> {
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
        operator: data.operator_id,
        machine: data.machine_id,
        operation: data.operation || '',
        notes: data.notes || '',
        operations: data.operations || [],
        dncPrograms: [], // Would need to fetch separately
        history: data.history || [],
        qualityRequirements: data.quality_requirements || [],
        tooling: [], // Would need to fetch separately
        materials: data.materials || [],
        drawings: data.drawings || [],
        aiRecommendation: data.ai_recommendation || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as CanonicalJob;
    } catch (err) {
      console.error('Error fetching job by ID:', err);
      return null;
    }
  },

  /**
   * Update job status
   */
  async updateJobStatus(user: any, jobId: string, status: JobStatus, notes?: string): Promise<boolean> {
    try {
      // Fetch job for validation
      const { data: job, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      if (fetchError) throw fetchError;
      // Permission check
      if (!canAccess(user, 'job:update', job)) {
        throw new Error('Permission denied: job:update');
      }
      const validationJob: ValidationJob = mapDbJobToValidationJob({ ...job, status });
      const errors = validateJob(validationJob);
      if (errors.length) {
        await logConsistencyFlag({
          type: 'validation',
          severity: 'error',
          resourceType: 'job',
          resourceId: jobId,
          context: { errors, job, attemptedStatus: status },
          detectedBy: 'jobsService.updateJobStatus',
          notes: 'Job validation failed during status update.'
        });
        throw new Error('Job validation failed: ' + errors.join('; '));
      }
      const { error } = await supabase
        .from('jobs')
        .update({
          status,
          notes: notes ? notes : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      if (error) throw error;
      // Audit log
      await logAudit({
        userId: user?.id || null,
        action: 'job.updateStatus',
        resourceType: 'job',
        resourceId: jobId,
        before: job,
        after: { ...job, status, notes },
        reason: notes
      });
      return true;
    } catch (err) {
      console.error('Error updating job status:', err);
      return false;
    }
  },

  /**
   * Update job progress (completed quantity)
   */
  async updateJobProgress(user: any, jobId: string, completedQuantity: number): Promise<boolean> {
    try {
      const { data: job, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      if (fetchError) throw fetchError;
      // Permission check
      if (!canAccess(user, 'job:update', job)) {
        await logConsistencyFlag({
          type: 'permission',
          severity: 'error',
          resourceType: 'job',
          resourceId: jobId,
          context: { user, job, attemptedCompletedQuantity: completedQuantity },
          detectedBy: 'jobsService.updateJobProgress',
          notes: 'Permission denied: job:update during progress update.'
        });
        return false;
      }
      // Ensure completed quantity doesn't exceed total quantity
      const validQuantity = Math.min(completedQuantity, job.quantity);
      // Validate with updated completedQuantity
      const validationJob: ValidationJob = mapDbJobToValidationJob({ ...job, completedQuantity: validQuantity });
      const errors = validateJob(validationJob);
      if (errors.length) {
        await logConsistencyFlag({
          type: 'validation',
          severity: 'error',
          resourceType: 'job',
          resourceId: jobId,
          context: { errors, job, attemptedCompletedQuantity: validQuantity },
          detectedBy: 'jobsService.updateJobProgress',
          notes: 'Job validation failed during progress update.'
        });
        return false;
      }
      const { error } = await supabase
        .from('jobs')
        .update({
          completed_quantity: validQuantity,
          status: validQuantity === job.quantity ? 'completed' : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);
      if (error) throw error;
      // Audit log
      await logAudit({
        userId: user?.id || null,
        action: 'job.updateProgress',
        resourceType: 'job',
        resourceId: jobId,
        before: job,
        after: { ...job, completed_quantity: validQuantity, status: validQuantity === job.quantity ? 'completed' : job.status },
        reason: 'Job progress updated.'
      });
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

// Helper to map DB job to minimal Job for validation only
function mapDbJobToValidationJob(job: any): ValidationJob {
  return {
    id: job.id,
    name: job.name || job.jobNumber || '',
    status: job.status,
    dueDate: job.due_date || job.dueDate,
    startDate: job.start_date || job.startDate,
    completedDate: job.completed_date || job.completedDate,
    priority: job.priority,
    assignedTo: job.operator_id || job.assignedTo,
    organizationId: job.organization_id || job.organizationId || '',
    itemIds: job.itemIds,
    lastUpdated: job.updated_at || job.lastUpdated || new Date().toISOString(),
    customFields: job.customFields,
    description: job.description,
  };
}