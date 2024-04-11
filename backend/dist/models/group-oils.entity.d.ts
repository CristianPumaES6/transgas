export declare class GroupOilEntity {
    id: number;
    userId: number;
    label: string;
    description: string;
    groupId: number;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, label?: string, description?: string, groupId?: number, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
    SyncStatus: string;
}
