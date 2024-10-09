import { Module } from '@nestjs/common';
import { SortAssetsService } from './sort-assets.service';
import { SortAssetsController } from './sort-assets.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileUploadService } from 'src/s3/s3.service';

@Module({
  controllers: [SortAssetsController],
  providers: [SortAssetsService, PrismaService, FileUploadService],
})
export class SortAssetsModule {}
