import { Module } from '@nestjs/common';
import { ReportsService } from './reports/reports.service';
import { ReportsController } from './reports/reports.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [SalesModule],
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService],
})
export class AdminModule {}
