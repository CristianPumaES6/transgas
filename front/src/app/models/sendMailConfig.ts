
export class SendMailConfig {
    public userId:number; // id Socket
    public emails:string

    constructor(
        userId?:number,
        emails?:string
    ){
        this.userId = userId || 0;
        this.emails = emails || '';
    }

}
