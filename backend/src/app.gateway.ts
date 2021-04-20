// Importamos la libreria Logger, sirve para imprimir log en consola.
import { Logger } from '@nestjs/common';
import {
  WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';


// Agregamos una decorator a la class para saber que sera una clase de WebSocket.
@WebSocketGateway(4000, { transport: ['websocket'] })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {



  // Instanciamos el webSocket
  @WebSocketServer()
  wss;

  // Le assignamos un nombre para diferenciarlo.
  private logger = new Logger('AppGateway');


  // Detectamos una conexion.
  public handleConnection(client) {

    // Lo mostramos en consola que un usuario se a conectado.
    this.logger.log('New client connected');

    // Emitimos al cliente un mensaje.
    client.emit('connection', 'connected');
  
  }

  // Detectamos si un usuario se a desconectado.
  public handleDisconnect(client) {
    // Mostramos en consola que un usuario se a desconectado.
    this.logger.log('Client disconnected');
  }
}
