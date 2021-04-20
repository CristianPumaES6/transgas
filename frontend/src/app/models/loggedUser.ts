
export class LoggedUser {

    constructor(
        public token? : string,
        public userName? : string,
    ){
        this.token = token || '';
        this.userName = userName || '';
    }

}
