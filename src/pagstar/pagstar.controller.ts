import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PagstarService } from './pagstar.service';
import { PagstarWebhook } from './dto/create-pagstar.dto';
import { PagstarGateway } from './pagstar.gateway';

@Controller('pagstar')
export class PagstarController {
  constructor(
    private readonly pagstarService: PagstarService,
    private pagstarGateway: PagstarGateway,
  ) {}

  @Post()
  receiveFromWebhook(@Body() body: PagstarWebhook) {
    return this.pagstarService.receiveFromWebhook(body);
  }

  @Get('/:id')
  dispairSocket(@Param('id') id: string) {
    return this.pagstarGateway.emitEvent(
      'deposit',
      {
        message: 'Hello world!',
        value: 100,
      },
      [id],
    );
  }
}
