import { LoggedUser } from "./loggedUser";

export class SocketEmitModel {
    
        public action: string;
        public data: LoggedUser;

 
    constructor(
        action?:string,
        data?:LoggedUser
    ){
        this.action = action || '';
        this.data = data || <any>{}; 
    }

}