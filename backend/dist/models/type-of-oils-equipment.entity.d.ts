export declare class TypeOfOilEquipmentEntity {
    id: number;
    userId: number;
    equipment: string;
    entityGroupId: number;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, equipment?: string, entityGroupId?: number, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
