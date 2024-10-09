import { Module } from '@nestjs/common';
import { SelledTitlesService } from './selled-titles.service';
import { SelledTitlesController } from './selled-titles.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SelledTitlesController],
  providers: [SelledTitlesService, PrismaService],
})
export class SelledTitlesModule {}
