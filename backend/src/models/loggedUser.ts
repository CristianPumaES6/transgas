export class LoggedUser {

    public token:string;
    public userName:string;
    public firstConnection: string;
    public lastConnection: string;
    
    constructor(
        token?:string,
        userName?:string,
        firstConnection?:string,
        lastConnection?:string,
    ){
        this.token = token || '';
        this.userName = userName || '';
        this.firstConnection = firstConnection || '';
        this.lastConnection = lastConnection || '';
    }

}
