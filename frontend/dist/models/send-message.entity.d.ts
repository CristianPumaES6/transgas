export declare class SendMessageEntity {
    id: number;
    userId: number;
    emails: string;
    typeSend: string;
    html: string;
    sendAutomatic: boolean;
    userIdCreated: number;
    dateCreated: string;
    userIdUpdated: number;
    dateUpdated: string;
    status: boolean;
    constructor(id?: number, userId?: number, emails?: string, typeSend?: string, html?: string, sendAutomatic?: boolean, userIdCreated?: number, dateCreated?: string, userIdUpdated?: number, dateUpdated?: string, status?: boolean);
}
