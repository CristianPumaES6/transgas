import { Injectable } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { GetDate } from './assets/moment.assets';
import { LoggedUser } from './models/loggedUser';
import { SocketEmitModel } from './models/socketEmit';
@Injectable()
export class AppService {

  constructor(
   private gateway: AppGateway, // Por mientras que este desactivado.
  ) {
  }


  // Cuando hay una nueva conexion verficamos todos los que esten conectados,
  public EmitConnect() : boolean{


    let socketEmitModel: SocketEmitModel = new SocketEmitModel();
    socketEmitModel.action='WHO_ARE_CONNECTED';

    // Emitimos una señal para recibir conexion de los usuario.
    this.gateway.wss.emit('EmitConnect', socketEmitModel); // Que este desactivado.
    return true;
  }

}
