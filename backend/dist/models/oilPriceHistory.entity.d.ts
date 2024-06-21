export declare class OilPriceHistory {
    id: number;
    userId: number;
    entityOilId: number;
    price: number;
    typeCurrency: string;
    effectiveDate: string;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, entityOilId?: number, price?: number, typeCurrency?: string, effectiveDate?: string, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
