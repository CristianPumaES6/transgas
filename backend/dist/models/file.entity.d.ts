export declare class FileEntity {
    id: number;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    description: string;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, fileName?: string, filePath?: string, fileType?: string, fileSize?: number, description?: string, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
