export class LoggedUser {

    public token:string;
    public userName:string;
    public firstConnection: string;
    public lastConnection: string;
    public lat: number;
    public lng:number;
    public isActive:boolean;

    constructor(
        token?:string,
        userName?:string,
        firstConnection?:string,
        lastConnection?:string,
        lat?: number,
        lng?:number,
        isActive?:boolean
    ){
        this.token = token || '';
        this.userName = userName || '';
        this.firstConnection = firstConnection || '';
        this.lastConnection = lastConnection || '';
        this.lat = lat || 0;
        this.lng = lng || 0;
        this.isActive = isActive || true;
    }

}
