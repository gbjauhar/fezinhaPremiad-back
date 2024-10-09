import { Module } from '@nestjs/common';
import { PagstarService } from './pagstar.service';
import { PagstarController } from './pagstar.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { PagstarUseCase } from './pagstar.usecase';
import { PagstarGateway } from './pagstar.gateway';

@Module({
  imports: [HttpModule],
  controllers: [PagstarController],
  providers: [PagstarService, PrismaService, PagstarUseCase, PagstarGateway],
  exports: [PagstarService, HttpModule],
})
export class PagstarModule {}
