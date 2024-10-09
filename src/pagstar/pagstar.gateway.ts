import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class PagstarGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('room')
  handleMessage(
    @MessageBody() payload: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload);
  }

  emitEvent<T = any>(event: string, payload: T, rooms?: string[]) {
    if (rooms) {
      const roomsResponse = [];

      for (const room of rooms) {
        roomsResponse.push(
          this.server.to(room).emit(`pagstar_${event}`, payload),
        );
      }

      return roomsResponse;
    }

    return this.server.emit(`pagstar_${event}`, payload);
  }
}
