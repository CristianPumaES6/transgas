
export class SendMailConfig {
    public userId:number; // id Socket
    public emails:string

    constructor(
        userId?:number,
        emails?:string
    ){
        this.userId = userId || 0 ;
        this.emails = emails || '';
    }

}

export class MailLastVoyage {
    public nameBuque:string;
    public dateCurrent:string;

    constructor(
        nameBuque?:string,
        dateCurrent?:string
    ) {
        this.nameBuque = nameBuque || ''; 
        this.dateCurrent = dateCurrent || null;
    }

}
