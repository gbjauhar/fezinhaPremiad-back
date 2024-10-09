import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreditHistoryService } from 'src/credit-history/credit-history.service';
import { SellersReportsController } from './reports/reports.controller';
import { SellersReportsService } from './reports/reports.service';

@Module({
  controllers: [SellersController, SellersReportsController],
  providers: [
    SellersService,
    PrismaService,
    CreditHistoryService,
    SellersReportsService,
  ],
})
export class SellersModule {}
