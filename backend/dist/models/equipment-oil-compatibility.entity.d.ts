export declare class EquipmentOilCompatibilityEntity {
    id: number;
    userId: number;
    entityEquipmentId: number;
    entityOilId: number;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, entityEquipmentId?: number, entityOilId?: number, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
