
export class LoggedUser {

    constructor(
        public clientId?:string,// id del socket
        public token?:string,
        public userName?:string,
        public firstConnection?: string,
        public lastConnection?: string,
        public lat?: number,
        public lng?:number,
        public isActive?:boolean,
    ){
        this.clientId = clientId || '';
        this.token = token || '';
        this.userName = userName || '';
        this.firstConnection = firstConnection || '';
        this.lastConnection = lastConnection || '';
        this.lat = lat || 0;
        this.lng = lng || 0;
        this.isActive = isActive || true;
    }

}
export class CantidadRestante {

    constructor(
        public voyage?:number,
        public port?:number,
        public report?: number,
    ){ 
        this.voyage = voyage || 0;
        this.port = port || 0; 
        this.report = report || 0; 
    }

}
