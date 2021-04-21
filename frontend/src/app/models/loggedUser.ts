
export class LoggedUser {

    constructor(
        public token?:string,
        public userName?:string,
        public firstConnection?: string,
        public lastConnection?: string,
    ){
        this.token = token || '';
        this.userName = userName || '';
        this.firstConnection = firstConnection || '';
        this.lastConnection = lastConnection || '';
    }

}
