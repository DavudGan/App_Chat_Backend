import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor() {
    console.log('ChatGateway started');
  }

  handleConnection(client: Socket) {
    console.log('Новое соединение:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any) {
    console.log('EVENT RECEIVED', data);
    this.server.emit('message', 'Новое сообщение: ' + data);
  }
}
