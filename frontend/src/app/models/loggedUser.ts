
export class LoggedUser {

    constructor(
        public token?:string,
        public userName?:string,
        public firstConnection?: string,
        public lastConnection?: string,
        public lat?: number,
        public lng?:number,
        public isActive?:boolean,
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
