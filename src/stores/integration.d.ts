import type { ConnectionConfig, ImportJob, ComplianceCheck, ExportControlFlag, ConnectionType, ImportType } from '../types/integration';
export declare const useIntegrationStore: import("pinia").StoreDefinition<"integration", Pick<{
    connections: import("vue").Ref<{
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[], ConnectionConfig[] | {
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    importJobs: import("vue").Ref<{
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[], ImportJob[] | {
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[]>;
    complianceChecks: import("vue").Ref<{
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[], ComplianceCheck[] | {
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[]>;
    exportFlags: import("vue").Ref<{
        jobId: string;
        classification: "itar" | "ear" | "dfars" | "uncontrolled";
        category?: string | undefined;
        restrictions: string[];
        authorizedPersonnel: string[];
        expirationDate?: string | undefined;
        notes?: string | undefined;
    }[], ExportControlFlag[] | {
        jobId: string;
        classification: "itar" | "ear" | "dfars" | "uncontrolled";
        category?: string | undefined;
        restrictions: string[];
        authorizedPersonnel: string[];
        expirationDate?: string | undefined;
        notes?: string | undefined;
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    activeConnections: import("vue").ComputedRef<{
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    connectionsByType: import("vue").ComputedRef<Record<ConnectionType, number>>;
    recentImports: import("vue").ComputedRef<{
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[]>;
    complianceAlerts: import("vue").ComputedRef<{
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[]>;
    fetchConnections: () => Promise<void>;
    fetchImportJobs: () => Promise<void>;
    fetchExportFlags: () => Promise<void>;
    createConnection: (connection: Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ConnectionConfig>;
    updateConnection: (connection: ConnectionConfig) => Promise<boolean>;
    deleteConnection: (connectionId: string) => Promise<boolean>;
    testConnection: (connectionId: string) => Promise<boolean>;
    runImport: (connectionId: string, importType: ImportType) => Promise<ImportJob>;
    checkCompliance: (jobId: string, userId: string, action: string) => Promise<ComplianceCheck>;
    scheduleAutomaticSync: (connectionId: string) => Promise<boolean>;
    optimizeJobSchedule: (departmentId?: string) => Promise<boolean>;
}, "error" | "loading" | "connections" | "importJobs" | "exportFlags" | "complianceChecks">, Pick<{
    connections: import("vue").Ref<{
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[], ConnectionConfig[] | {
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    importJobs: import("vue").Ref<{
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[], ImportJob[] | {
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[]>;
    complianceChecks: import("vue").Ref<{
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[], ComplianceCheck[] | {
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[]>;
    exportFlags: import("vue").Ref<{
        jobId: string;
        classification: "itar" | "ear" | "dfars" | "uncontrolled";
        category?: string | undefined;
        restrictions: string[];
        authorizedPersonnel: string[];
        expirationDate?: string | undefined;
        notes?: string | undefined;
    }[], ExportControlFlag[] | {
        jobId: string;
        classification: "itar" | "ear" | "dfars" | "uncontrolled";
        category?: string | undefined;
        restrictions: string[];
        authorizedPersonnel: string[];
        expirationDate?: string | undefined;
        notes?: string | undefined;
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    activeConnections: import("vue").ComputedRef<{
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    connectionsByType: import("vue").ComputedRef<Record<ConnectionType, number>>;
    recentImports: import("vue").ComputedRef<{
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[]>;
    complianceAlerts: import("vue").ComputedRef<{
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[]>;
    fetchConnections: () => Promise<void>;
    fetchImportJobs: () => Promise<void>;
    fetchExportFlags: () => Promise<void>;
    createConnection: (connection: Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ConnectionConfig>;
    updateConnection: (connection: ConnectionConfig) => Promise<boolean>;
    deleteConnection: (connectionId: string) => Promise<boolean>;
    testConnection: (connectionId: string) => Promise<boolean>;
    runImport: (connectionId: string, importType: ImportType) => Promise<ImportJob>;
    checkCompliance: (jobId: string, userId: string, action: string) => Promise<ComplianceCheck>;
    scheduleAutomaticSync: (connectionId: string) => Promise<boolean>;
    optimizeJobSchedule: (departmentId?: string) => Promise<boolean>;
}, "activeConnections" | "connectionsByType" | "recentImports" | "complianceAlerts">, Pick<{
    connections: import("vue").Ref<{
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[], ConnectionConfig[] | {
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    importJobs: import("vue").Ref<{
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[], ImportJob[] | {
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[]>;
    complianceChecks: import("vue").Ref<{
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[], ComplianceCheck[] | {
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[]>;
    exportFlags: import("vue").Ref<{
        jobId: string;
        classification: "itar" | "ear" | "dfars" | "uncontrolled";
        category?: string | undefined;
        restrictions: string[];
        authorizedPersonnel: string[];
        expirationDate?: string | undefined;
        notes?: string | undefined;
    }[], ExportControlFlag[] | {
        jobId: string;
        classification: "itar" | "ear" | "dfars" | "uncontrolled";
        category?: string | undefined;
        restrictions: string[];
        authorizedPersonnel: string[];
        expirationDate?: string | undefined;
        notes?: string | undefined;
    }[]>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    activeConnections: import("vue").ComputedRef<{
        id: string;
        name: string;
        type: ConnectionType;
        status: "active" | "inactive" | "error" | "testing";
        config: {
            spreadsheetId?: string | undefined;
            sheetName?: string | undefined;
            range?: string | undefined;
            baseUrl?: string | undefined;
            apiKey?: string | undefined;
            authType?: "basic" | "bearer" | "oauth" | undefined;
            headers?: Record<string, string> | undefined;
            connectionString?: string | undefined;
            databaseName?: string | undefined;
            table?: string | undefined;
            query?: string | undefined;
            sapHost?: string | undefined;
            sapClient?: string | undefined;
            sapUser?: string | undefined;
            sapPassword?: string | undefined;
            sapSystem?: string | undefined;
            host?: string | undefined;
            port?: number | undefined;
            username?: string | undefined;
            password?: string | undefined;
            privateKey?: string | undefined;
            remotePath?: string | undefined;
            endpoint?: string | undefined;
            secret?: string | undefined;
            fileFormat?: "csv" | "tsv" | "excel" | undefined;
            delimiter?: string | undefined;
            hasHeaderRow?: boolean | undefined;
            pollInterval?: number | undefined;
            pollIntervalMinutes?: number | undefined;
            batchSize?: number | undefined;
            retryAttempts?: number | undefined;
            timeout?: number | undefined;
        };
        complianceLevel: import("../types/integration").ComplianceLevel;
        lastSync?: string | undefined;
        errorCount: number;
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        createdAt: string;
        updatedAt: string;
    }[]>;
    connectionsByType: import("vue").ComputedRef<Record<ConnectionType, number>>;
    recentImports: import("vue").ComputedRef<{
        id: string;
        connectionId: string;
        type: ImportType;
        status: "pending" | "running" | "completed" | "failed";
        mapping: {
            sourceField: string;
            targetField: string;
            transform?: "number" | "uppercase" | "lowercase" | "trim" | "date" | undefined;
            required: boolean;
            complianceFlag?: boolean | undefined;
        }[];
        recordsProcessed: number;
        recordsSuccess: number;
        recordsError: number;
        errors: {
            row: number;
            field?: string | undefined;
            value?: any;
            error: string;
            severity: "error" | "warning" | "critical";
        }[];
        startedAt?: string | undefined;
        completedAt?: string | null | undefined;
    }[]>;
    complianceAlerts: import("vue").ComputedRef<{
        jobId: string;
        userId: string;
        action: string;
        result: "allowed" | "denied" | "restricted";
        rules: string[];
        timestamp: string;
        ipAddress?: string | undefined;
        location?: string | undefined;
    }[]>;
    fetchConnections: () => Promise<void>;
    fetchImportJobs: () => Promise<void>;
    fetchExportFlags: () => Promise<void>;
    createConnection: (connection: Omit<ConnectionConfig, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ConnectionConfig>;
    updateConnection: (connection: ConnectionConfig) => Promise<boolean>;
    deleteConnection: (connectionId: string) => Promise<boolean>;
    testConnection: (connectionId: string) => Promise<boolean>;
    runImport: (connectionId: string, importType: ImportType) => Promise<ImportJob>;
    checkCompliance: (jobId: string, userId: string, action: string) => Promise<ComplianceCheck>;
    scheduleAutomaticSync: (connectionId: string) => Promise<boolean>;
    optimizeJobSchedule: (departmentId?: string) => Promise<boolean>;
}, "fetchConnections" | "fetchImportJobs" | "fetchExportFlags" | "createConnection" | "updateConnection" | "deleteConnection" | "testConnection" | "runImport" | "checkCompliance" | "scheduleAutomaticSync" | "optimizeJobSchedule">>;
