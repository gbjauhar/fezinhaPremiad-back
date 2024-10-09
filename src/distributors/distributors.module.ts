import { Module } from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { DistributorsController } from './distributors.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DistributorsController],
  providers: [DistributorsService, PrismaService],
})
export class DistributorsModule {}
