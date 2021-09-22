export declare class LoggedUser {
    token: string;
    userName: string;
    firstConnection: string;
    lastConnection: string;
    lat: number;
    lng: number;
    isActive: boolean;
    constructor(token?: string, userName?: string, firstConnection?: string, lastConnection?: string, lat?: number, lng?: number, isActive?: boolean);
}
