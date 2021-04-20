import { Logger } from '@nestjs/common';
import {
  WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway(4000, { transport: ['websocket'] })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss;

  private logger = new Logger('AppGateway');

  handleConnection(client) {

    console.log('--------------------------');
    console.log('--------------------------');
    console.log('------------COOO--------------');
    console.log('--------------------------');
    console.log('--------------------------');
    this.logger.log('New client connected');
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client) {

    console.log('--------------------------');
    console.log('--------------------------');
    console.log('-----------DIS---------------');
    console.log('--------------------------');
    console.log('--------------------------');
    this.logger.log('Client disconnected');
  }
}
