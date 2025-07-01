import type { ConnectionConfig, ImportJob, ComplianceCheck, ExportControlFlag, ImportType, ImportMapping } from '../types/integration';
export declare const integrationService: {
    /**
     * Fetch all connections
     */
    fetchConnections(): Promise<ConnectionConfig[]>;
    /**
     * Fetch import jobs
     */
    fetchImportJobs(): Promise<ImportJob[]>;
    /**
     * Create a new connection
     */
    createConnection(connection: Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ConnectionConfig>;
    /**
     * Update an existing connection
     */
    updateConnection(connection: ConnectionConfig): Promise<boolean>;
    /**
     * Delete a connection
     */
    deleteConnection(connectionId: string): Promise<boolean>;
    /**
     * Test a connection
     */
    testConnection(connectionId: string): Promise<boolean>;
    /**
     * Test REST API connection
     */
    testRestApiConnection(config: any): Promise<boolean>;
    /**
     * Test Google Sheets connection
     */
    testGoogleSheetsConnection(): Promise<boolean>;
    /**
     * Test SQL connection
     */
    testSqlConnection(): Promise<boolean>;
    /**
     * Test SAP connection
     */
    testSapConnection(): Promise<boolean>;
    /**
     * Test SFTP connection
     */
    testSftpConnection(): Promise<boolean>;
    /**
     * Run an import job
     */
    runImport(connectionId: string, importType: ImportType): Promise<ImportJob>;
    /**
     * Process an import job
     */
    processImport(importJob: ImportJob, connection: any): Promise<void>;
    /**
     * Import data from REST API
     */
    importFromRestApi(config: any, importType: ImportType): Promise<any[]>;
    /**
     * Import data from Google Sheets
     */
    importFromGoogleSheets(_config: any, importType: ImportType): Promise<any[]>;
    /**
     * Import data from SQL
     */
    importFromSql(_config: any, importType: ImportType): Promise<any[]>;
    /**
     * Import data from SAP
     */
    importFromSap(_config: any, importType: ImportType): Promise<any[]>;
    /**
     * Import data from SFTP
     */
    importFromSftp(_config: any, importType: ImportType): Promise<any[]>;
    /**
     * Process imported data
     */
    processImportData(data: any[], mapping: ImportMapping[], importType: ImportType, complianceLevel: string): Promise<{
        processed: number;
        success: number;
        errors: any[];
    }>;
    /**
     * Get mock data for testing
     */
    getMockData(importType: ImportType, count: number): any[];
    /**
     * Check compliance for a job
     */
    checkCompliance(jobId: string, userId: string, action: string): Promise<ComplianceCheck>;
    /**
     * Fetch export control flags
     */
    fetchExportFlags(): Promise<ExportControlFlag[]>;
    /**
     * Process file upload for CSV/Excel import
     */
    processFileUpload(file: File, connectionId: string, importType: ImportType): Promise<ImportJob>;
    /**
     * Process uploaded file
     */
    processUploadedFile(file: File, importJob: ImportJob, connection: any): Promise<void>;
    /**
     * Read file data
     */
    readFileData(file: File, format: 'csv' | 'tsv' | 'excel'): Promise<any[]>;
    /**
     * Parse CSV data
     */
    parseCSV(content: string, delimiter: string): any[];
    /**
     * Schedule automatic sync
     */
    scheduleAutomaticSync(connectionId: string): Promise<boolean>;
    /**
     * AI-powered job shuffling
     */
    optimizeJobSchedule(departmentId?: string): Promise<boolean>;
    /**
     * AI-powered job recommendations
     */
    getJobRecommendations(operatorId: string): Promise<any[]>;
};
