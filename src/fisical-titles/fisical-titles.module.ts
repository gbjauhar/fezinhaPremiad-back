import { Module } from '@nestjs/common';
import { FisicalTitlesService } from './fisical-titles.service';
import { FisicalTitlesController } from './fisical-titles.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FisicalTitlesController],
  providers: [FisicalTitlesService, PrismaService],
})
export class FisicalTitlesModule {}
