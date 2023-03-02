
export class SendMessageEntity {
    constructor(

        public id?: number,
        // userId : servira para hacer auditoria.

        public userId?: number,
        // userId : servira para hacer auditoria.

        public emails?: string,

        // Tipo de envio de las 08:00 HRs o del medio dia

        public typeSend?: string,

        public html?: string,

        public sendAutomatic?: boolean,

        // Auditoria

        public userIdCreated?: number,

        public dateCreated?: string,


        public userIdUpdated?: number,

        public dateUpdated?: string,


        public status?: boolean

    ) {
        this.id = id || null;
        this.userId = userId || null;
        this.emails = emails || '';
        this.typeSend = typeSend || '';
        this.html = html || '';
        this.sendAutomatic = sendAutomatic || false;
        this.userIdCreated = userIdCreated || null;
        this.dateCreated = dateCreated || null;
        this.userIdUpdated = userIdUpdated || null;
        this.dateUpdated = dateUpdated || null;
        this.status = status || false;
    }
}