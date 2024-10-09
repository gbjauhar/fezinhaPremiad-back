import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValueHistoryController } from './value-history.controller';
import { ValueHistoryService } from './value-history.service';

@Module({
  controllers: [ValueHistoryController],
  providers: [ValueHistoryService, PrismaService],
})
export class ValueHistoryModule {}
