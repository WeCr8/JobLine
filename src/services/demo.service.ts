import { supabase } from './api.service';

export const demoService = {
  /**
   * Seed demo data for the application
   */
  async seedDemoData(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('seed-demo-data', {
        method: 'POST',
        body: {}
      });
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error seeding demo data:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Shuffle job priorities to simulate changing conditions
   */
  async shuffleJobPriorities(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Get all active jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, priority')
        .in('status', ['pending', 'setup', 'running']);
      
      if (jobsError) throw jobsError;
      
      if (!jobs || jobs.length === 0) {
        return { success: false, error: 'No active jobs found to shuffle' };
      }
      
      // Shuffle priorities
      const priorities = ['low', 'medium', 'high', 'urgent'];
      const updates = jobs.map(job => ({
        id: job.id,
        priority: priorities[Math.floor(Math.random() * priorities.length)]
      }));
      
      // Update jobs in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        const { error: updateError } = await supabase
          .from('jobs')
          .upsert(batch);
        
        if (updateError) throw updateError;
      }
      
      return { 
        success: true, 
        message: `Successfully shuffled priorities for ${updates.length} jobs` 
      };
    } catch (err: any) {
      console.error('Error shuffling job priorities:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Reorder job statuses to simulate production progress
   */
  async advanceJobStatuses(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Get all active jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, status, completed_quantity, quantity')
        .in('status', ['pending', 'setup', 'running']);
      
      if (jobsError) throw jobsError;
      
      if (!jobs || jobs.length === 0) {
        return { success: false, error: 'No active jobs found to advance' };
      }
      
      // Advance statuses
      const updates = jobs.map(job => {
        let newStatus = job.status;
        let newCompletedQuantity = job.completed_quantity;
        
        // Randomly advance status
        if (job.status === 'pending') {
          newStatus = 'setup';
        } else if (job.status === 'setup') {
          newStatus = 'running';
        } else if (job.status === 'running') {
          // Increase completed quantity
          newCompletedQuantity = Math.min(
            job.quantity, 
            job.completed_quantity + Math.floor(Math.random() * (job.quantity * 0.3))
          );
          
          // If completed all parts, mark as completed
          if (newCompletedQuantity >= job.quantity) {
            newStatus = 'completed';
          }
        }
        
        return {
          id: job.id,
          status: newStatus,
          completed_quantity: newCompletedQuantity
        };
      });
      
      // Update jobs in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        const { error: updateError } = await supabase
          .from('jobs')
          .upsert(batch);
        
        if (updateError) throw updateError;
      }
      
      return { 
        success: true, 
        message: `Successfully advanced statuses for ${updates.length} jobs` 
      };
    } catch (err: any) {
      console.error('Error advancing job statuses:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Reset demo data to initial state
   */
  async resetDemoData(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // This would typically clear existing data and re-seed
      // For simplicity, we'll just call the seed function again
      return await this.seedDemoData();
    } catch (err: any) {
      console.error('Error resetting demo data:', err);
      return { success: false, error: err.message };
    }
  }
};