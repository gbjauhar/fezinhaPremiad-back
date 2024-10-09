import { Module } from '@nestjs/common';
import { SortEditionService } from './sort-edition.service';
import { SortEditionGateway } from './sort-edition.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { SortEditionController } from './sort-edition.controller';

@Module({
  controllers: [SortEditionController],
  providers: [SortEditionGateway, SortEditionService, PrismaService],
})
export class SortEditionModule {}
