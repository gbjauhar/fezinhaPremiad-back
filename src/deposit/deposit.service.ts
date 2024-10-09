import { Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { PagstarService } from 'src/pagstar/pagstar.service';
import { OptionsToPay } from '@prisma/client';
import { ValueHistoryService } from 'src/value-history/value-history.service';
import { currencyValue } from 'src/utils/currencyValue';

@Injectable()
export class DepositService {
  constructor(
    private pagstar: PagstarService,
    private valueHistoryService: ValueHistoryService,
  ) {}

  async depositToUser(createDepositDto: CreateDepositDto) {
    const payment = await this.pagstar.create({
      option: OptionsToPay.VALUE,
      name: `Depósito de ${createDepositDto.value}`,
      value: createDepositDto.value,
      userId: createDepositDto.userId,
    });

    await this.valueHistoryService.create({
      deposit_type: 'PIX',
      name: `Você gerou um QRCode de ${currencyValue(createDepositDto.value)}`,
      description: `Você realizou gerou um QRCode de depósito no valor de ${currencyValue(
        createDepositDto.value,
      )}`,
      status: 'PENDING',
      user_id: createDepositDto.userId,
      value: createDepositDto.value,
      reference: payment.reference,
    });

    return payment;
  }

  findAll() {
    return `This action returns all deposit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deposit`;
  }
}
