import { Module } from '@nestjs/common';
import { EditionsService } from './editions.service';
import { EditionsController } from './editions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/s3/s3.service';

@Module({
  controllers: [EditionsController],
  providers: [EditionsService, PrismaService, FileUploadService],
})
export class EditionsModule {}
