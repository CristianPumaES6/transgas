import { Injectable } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { LoggedUser } from './models/loggedUser';
@Injectable()
export class AppService {

  constructor(
    private gateway: AppGateway,
  ) {
    
    // Creamos un escucha para registrar un nuevo usuario.
    /*
    this.gateway.wss.on('disconect', function(msg) {

      console.log("User Disconect");
      console.log(msg);
    }); */
  }

  public loggedUsers : LoggedUser[] = [];


  getHello(): string {
    return 'Hello World!';
  }

  // Verifica si el usuario logeado existe,
  // Si exite lo actualiza
  // Si no exite lo registra
  public IsUserLogeatedExit(loggedUser:LoggedUser) : boolean {
    // Verificamos si existe el usuario
    let isUserExit = this.loggedUsers.find(
      (logeate) => { 
        return logeate.token === loggedUser.token
      });

    // este usuario existe?
    if(isUserExit){
     return false;
    }else{
      // si no existe 
      this.AddUserLogeated(loggedUser);
      return true;
    }
  }

  private AddUserLogeated(loggedUser:LoggedUser):boolean{
    this.loggedUsers.push(loggedUser);
    return true;
  }
  private UpdateUserLogeated(loggedUser:LoggedUser):boolean{


    return true;
  }

}
