import { Module } from '@nestjs/common';
import { CreditHistoryService } from './credit-history.service';
import { CreditHistoryController } from './credit-history.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CreditHistoryController],
  providers: [CreditHistoryService, PrismaService],
})
export class CreditHistoryModule {}
