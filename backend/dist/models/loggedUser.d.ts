export declare class LoggedUser {
    clientId: string;
    token: string;
    userName: string;
    firstConnection: string;
    lastConnection: string;
    lat: number;
    lng: number;
    isActive: boolean;
    constructor(clientId?: string, token?: string, userName?: string, firstConnection?: string, lastConnection?: string, lat?: number, lng?: number, isActive?: boolean);
}
