export declare class ConsumptionEquipmentEntity {
    id: number;
    userId: number;
    date: string;
    amount: number;
    hourConsumption: number;
    observation: string;
    entityEquipmentId: number;
    entityOilId: number;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, date?: string, amount?: number, hourConsumption?: number, observation?: string, entityEquipmentId?: number, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
