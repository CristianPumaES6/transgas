export declare class EquipmentSystemEntity {
    id: number;
    userId: number;
    equipment: string;
    rate: number;
    entityFrequencyId: number;
    entityGroupId: number;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, equipment?: string, rate?: number, entityFrequencyId?: number, entityGroupId?: number, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
