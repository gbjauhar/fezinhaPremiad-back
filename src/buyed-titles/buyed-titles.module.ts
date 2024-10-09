import { Module } from '@nestjs/common';
import { BuyedTitlesService } from './buyed-titles.service';
import { BuyedTitlesController } from './buyed-titles.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BuyedTitlesController],
  providers: [BuyedTitlesService, PrismaService],
})
export class BuyedTitlesModule {}
