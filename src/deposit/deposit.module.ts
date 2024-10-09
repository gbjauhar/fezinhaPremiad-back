import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagstarModule } from 'src/pagstar/pagstar.module';
import { ValueHistoryService } from 'src/value-history/value-history.service';

@Module({
  imports: [PagstarModule],
  controllers: [DepositController],
  providers: [DepositService, PrismaService, ValueHistoryService],
})
export class DepositModule {}
