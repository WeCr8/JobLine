export interface Drawing {
    id: string;
    name: string;
    revision: string;
    filePath: string;
    type: 'part' | 'assembly' | 'detail' | 'setup';
    lastModified: string;
    operationId?: string;
}
