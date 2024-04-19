export declare class BunkerOil {
    id: number;
    userId: number;
    entityOilId: number;
    bunker: number;
    comment: string;
    datetime: string;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, entityOilId?: number, bunker?: number, comment?: string, datetime?: string, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
