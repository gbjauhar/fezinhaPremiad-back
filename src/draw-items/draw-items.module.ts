import { Module } from '@nestjs/common';
import { DrawItemsService } from './draw-items.service';
import { DrawItemsController } from './draw-items.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/s3/s3.service';

@Module({
  controllers: [DrawItemsController],
  providers: [DrawItemsService, PrismaService, FileUploadService],
})
export class DrawItemsModule {}
