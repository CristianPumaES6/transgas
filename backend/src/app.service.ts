import { Injectable } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { GetDate } from './assets/moment.assets';
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

    // Este usuario existe?
    if(isUserExit) {

      loggedUser.lastConnection = GetDate();

      this.UpdateUserLogeated(loggedUser);
      
      return false;
    } else {

      loggedUser.firstConnection = GetDate();
      loggedUser.lastConnection = GetDate();

      // Si no existe 
      this.AddUserLogeated(loggedUser);
      console.log(this.loggedUsers);
      
      return true;
    }
  }

  private AddUserLogeated(loggedUser:LoggedUser):boolean{
    this.loggedUsers.push(loggedUser);
    return true;
  }

  private UpdateUserLogeated(loggedUser:LoggedUser):boolean{

    if (loggedUser.lat == 0 && loggedUser.lng == 0) {
    } else {

    }

    // Tenemos que actualizare 
    return true;
  }


  public GetLoggedUsers(): LoggedUser[]{
    return this.loggedUsers;
  }

  public EmitConnect() : boolean{
        
    this.loggedUsers.forEach(
      loggedUser => {
        loggedUser.isActive = false;
      }
    );

    this.gateway.wss.emit('connection', 'connected');
    return true;
  }

}
