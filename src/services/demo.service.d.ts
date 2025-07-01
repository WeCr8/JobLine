export declare const demoService: {
    /**
     * Seed demo data for the application
     */
    seedDemoData(): Promise<{
        success: boolean;
        message?: string;
        error?: string;
    }>;
    /**
     * Shuffle job priorities to simulate changing conditions
     */
    shuffleJobPriorities(): Promise<{
        success: boolean;
        message?: string;
        error?: string;
    }>;
    /**
     * Reorder job statuses to simulate production progress
     */
    advanceJobStatuses(): Promise<{
        success: boolean;
        message?: string;
        error?: string;
    }>;
    /**
     * Reset demo data to initial state
     */
    resetDemoData(): Promise<{
        success: boolean;
        message?: string;
        error?: string;
    }>;
    /**
     * Get hardcoded demo data for various entities
     */
    getDemoData(entity: string): any[];
    /**
     * Get hardcoded demo jobs
     */
    getDemoJobs(): any[];
    /**
     * Get hardcoded demo operations
     */
    getDemoOperations(): any[];
    /**
     * Get hardcoded demo machines
     */
    getDemoMachines(): any[];
    /**
     * Get hardcoded demo users
     */
    getDemoUsers(): any[];
    /**
     * Get hardcoded demo departments
     */
    getDemoDepartments(): any[];
    /**
     * Get hardcoded demo passdown notes
     */
    getDemoPassdownNotes(): any[];
};
