import { LoggedUser } from "./loggedUser";

export class SocketEmitModel {
    
        public message: string;
        public data: LoggedUser;

 
    constructor(
        message?:string,
        data?:LoggedUser
    ){
        this.message = message || '';
        this.data = data || <any>{}; 
    }

}