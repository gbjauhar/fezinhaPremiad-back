import { Module } from '@nestjs/common';
import { ScratchCardsService } from './scratch-cards.service';
import { ScratchCardsController } from './scratch-cards.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ScratchCardsController],
  providers: [ScratchCardsService, PrismaService],
})
export class ScratchCardsModule {}
