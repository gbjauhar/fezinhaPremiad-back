import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SortEditionService } from './sort-edition.service';
import { AddSortNumberEditionDto } from './dto/create-sort-edition.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class SortEditionGateway {
  constructor(private sortEditionService: SortEditionService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  create(@MessageBody() data: string) {
    return data;
  }

  @Roles(Role.ADMIN)
  @SubscribeMessage('addSortDozen')
  async addDozen(@MessageBody() data: AddSortNumberEditionDto) {
    const drawItemSorted = await this.sortEditionService.addDozen(data);
    this.server.emit(
      `listenSortDozen/${drawItemSorted.sortEdition.id}`,
      drawItemSorted,
    );

    return drawItemSorted;
  }

  @Roles(Role.ADMIN)
  @SubscribeMessage('removeSortDozen')
  async removerDozen(@MessageBody() data: AddSortNumberEditionDto) {
    const drawItemSorted = await this.sortEditionService.removeDozen(data);
    this.server.emit(
      `listenSortDozen/${drawItemSorted.sortEdition.id}`,
      drawItemSorted,
    );

    return drawItemSorted;
  }

  emitEvent<T = any>(event: string, data: T) {
    this.server.emit(event, data);
  }
}
