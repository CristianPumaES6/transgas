export declare class EquipmentSystemEntity {
    id: number;
    userId: number;
    equipment: string;
    trialDay: number;
    lubUsedDuringMaintenance: number;
    ETM_OilAnalysis_Oid: string;
    frequencyId: number;
    entityGroupId: number;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, equipment?: string, trialDay?: number, lubUsedDuringMaintenance?: number, ETM_OilAnalysis_Oid?: string, frequencyId?: number, entityGroupId?: number, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
