import { HttpException, Injectable } from '@nestjs/common';
import { Payment, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { currencyValue } from 'src/utils/currencyValue';
import { PagstarGateway } from './pagstar.gateway';

@Injectable()
export class PagstarUseCase {
  constructor(
    private prisma: PrismaService,
    private pagstarGateway: PagstarGateway,
  ) {}

  async pagTitles(payment: Payment & { user: User }) {
    const titleQuantities = payment.name.split(' ')[2];

    const user = await this.prisma.user.findFirst({
      where: {
        id: payment.user.id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const insertedValue = await this.prisma.valueHistory.create({
      data: {
        name: `Pagamento de ${currencyValue(payment.value)}`,
        description: `Você realizou a compra de ${titleQuantities} títulos no valor de ${currencyValue(
          payment.value,
        )}`,
        deposit_type: 'PIX',
        status: 'DONE',
        type: 'OTHER',
        user_id: payment.user_id,
        value: payment.value,
        reference: payment.reference,
      },
    });

    if (payment.buyed_title_id) {
      await this.prisma.buyedTitles.update({
        where: {
          id: payment.buyed_title_id,
        },
        data: {
          status: 'DONE',
        },
      });
    }

    this.pagstarGateway.emitEvent(
      'payed_titles',
      {
        valueHistory: insertedValue,
      },
      [user.id],
    );
  }

  async pagDeposit(payment: Payment & { user: User }) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: payment.user.id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const insertedValue = await this.prisma.valueHistory.create({
      data: {
        name: `Depósito de ${currencyValue(payment.value)}`,
        description: `Você realizou um depósito de ${currencyValue(
          payment.value,
        )}`,
        deposit_type: 'PIX',
        status: 'DONE',
        type: 'DEPOSIT',
        user_id: payment.user_id,
        value: payment.value,
        reference: payment.reference,
      },
    });

    await this.prisma.user.update({
      where: {
        id: payment.user.id,
      },
      data: {
        value: user.value + payment.value,
      },
    });

    this.pagstarGateway.emitEvent(
      'deposit',
      {
        valueHistory: insertedValue,
      },
      [user.id],
    );
  }
}
