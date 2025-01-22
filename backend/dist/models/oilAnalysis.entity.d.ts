export declare class OilAnalysisEntity {
    id: number;
    equipmentOilCompatibilityId: number;
    fileId: number;
    analysisDate: string;
    comments: string;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, equipmentOilCompatibilityId?: number, fileId?: number, analysisDate?: string, comments?: string, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
