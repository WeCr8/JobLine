import type { Job, JobStatus, QualityCheck } from '../types';
export declare const jobsService: {
    /**
     * Fetch all jobs
     */
    fetchJobs(): Promise<Job[]>;
    /**
     * Get a job by ID
     */
    getJobById(jobId: string): Promise<Job | null>;
    /**
     * Update job status
     */
    updateJobStatus(jobId: string, status: JobStatus, notes?: string): Promise<boolean>;
    /**
     * Update job progress (completed quantity)
     */
    updateJobProgress(jobId: string, completedQuantity: number): Promise<boolean>;
    /**
     * Update operation status
     */
    updateOperationStatus(operationId: string, status: string): Promise<boolean>;
    /**
     * Add quality check
     */
    addQualityCheck(check: Omit<QualityCheck, 'id'>): Promise<QualityCheck | null>;
};
