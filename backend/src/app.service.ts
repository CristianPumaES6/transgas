import { Injectable } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { GetDate } from './assets/moment.assets';
import { LoggedUser } from './models/loggedUser';
@Injectable()
export class AppService {

  constructor(
   private gateway: AppGateway, // Por mientras que este desactivado.
  ) {
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
      this.UpdateUserLogeated(loggedUser);
      
      return false;
    } else {

      // Si no existe 
      this.AddUserLogeated(loggedUser);
      
      return true;
    }
  }

  // Agregamos a los usuarios logeados.
  private AddUserLogeated(loggedUser:LoggedUser):boolean{

    loggedUser.firstConnection = GetDate();
    loggedUser.lastConnection = GetDate();
    loggedUser.isActive = true;
    this.loggedUsers.push(loggedUser);

    return true;

  }

  // Actualizamos los usuarios logeados.
  private UpdateUserLogeated(loggedUser:LoggedUser):boolean{

    
    this.loggedUsers.forEach( logged => {
      // Verificamos que el token sea el mismo para actualizar su longitud y latitud.
      if ( logged.token === loggedUser.token ) {

        // Actualizamos la ultima hora de conexion.
        logged.lastConnection = GetDate();

        // si la latitud y la longitud es la misma no actualizo.
        if (loggedUser.lat == 0 && loggedUser.lng == 0) {
        } else {
          // actualizamos la latiud y la longitud.
          logged.lat = loggedUser.lat;
          logged.lat = loggedUser.lng;
        }

        logged.isActive = true;
      }
    });

    // Tenemos que actualizare 
    return true;
  }

  // Obtenemos los usuarios que estan logeados.
  public GetLoggedUsers(): LoggedUser[]{
    return this.loggedUsers;
  }

  // Cuando hay una nueva conexion verficamos todos los que esten conectados,
  public EmitConnect() : boolean{
        
    this.loggedUsers.forEach(
      loggedUser => {
        loggedUser.isActive = false;
      }
    );

  //   this.gateway.wss.emit('connection2', 'connected'); // Que este desactivado.
    return true;
  }

}
