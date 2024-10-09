import { HttpException, Injectable } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindWithdrawsDto } from './dto/find-withdraws.dto';
import { currencyValue } from 'src/utils/currencyValue';
import { format } from 'date-fns';
import { FindAllWithdrawDto } from './dto/find-all-withdraw.dto';
import { userField } from './filters/user-filter';
import { plainToInstance } from 'class-transformer';
import { Withdraw } from './entities/withdraw.entity';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWithdrawDto: CreateWithdrawDto, user_id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const newValue = user.value - createWithdrawDto.value;

    if (user.value < createWithdrawDto.value) {
      throw new HttpException(
        'Seu saldo não é suficiente para sacar essa quantidade',
        400,
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        value: newValue <= 0 ? 0 : newValue,
      },
    });

    const withdraw = await this.prisma.withdraw.create({
      data: {
        value: createWithdrawDto.value,
        description: createWithdrawDto.description,
        payment_form: createWithdrawDto.payment_form,
        pix: createWithdrawDto.pix,
        user_id,
      },
    });

    await this.prisma.valueHistory.create({
      data: {
        value: createWithdrawDto.value,
        name: 'Solicitação de saque',
        description: `Você realizou uma solicitação de saque no valor de ${currencyValue(
          createWithdrawDto.value,
        )}. Esse valor será depositado em até 3 dias úteis`,
        date_format: format(new Date(), 'dd/MM/yyyy'),
        user_id,
        deposit_type: 'PIX',
        type: 'WITHDRAW',
      },
    });

    return withdraw;
  }

  async findAll({ field, value, limit = 10, page = 1 }: FindAllWithdrawDto) {
    const customField = !userField(field, value) ? field : undefined;
    const customValue = !userField(field, value) ? value : undefined;

    const withdraws = await this.prisma.withdraw.findMany({
      where: {
        [customField]: customValue,
        ...userField(field, value),
      },
      include: {
        user: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const withdrawsCount = await this.prisma.withdraw.count({
      where: {
        [customField]: customValue,
        ...userField(field, value),
      },
    });

    return {
      withdraws: plainToInstance(Withdraw, withdraws),
      totalPage: Math.ceil(withdrawsCount / limit),
      hasNextPage: page < Math.ceil(withdrawsCount / limit),
    };
  }

  async findAllMyWithdraws(findWithdrawsDto: FindWithdrawsDto) {
    const withdraws = await this.prisma.withdraw.findMany({
      where: {
        user_id: findWithdrawsDto.user_id,
      },
    });

    return withdraws;
  }

  async findOne(id: string) {
    const withdraw = await this.prisma.withdraw.findFirst({
      where: {
        id,
      },
    });

    if (!withdraw) {
      throw new HttpException('Solicitação não encontrada', 400);
    }

    return withdraw;
  }

  async update(id: string, updateWithdrawDto: UpdateWithdrawDto) {
    let withdraw = await this.prisma.withdraw.findFirst({
      where: {
        id,
      },
    });

    if (!withdraw) {
      throw new HttpException('Solicitação não encontrada', 400);
    }

    withdraw = await this.prisma.withdraw.update({
      where: {
        id,
      },
      data: updateWithdrawDto,
    });

    return withdraw;
  }

  async remove(id: string) {
    let withdraw = await this.prisma.withdraw.findFirst({
      where: {
        id,
      },
    });

    if (!withdraw) {
      throw new HttpException('Solicitação não encontrada', 400);
    }

    withdraw = await this.prisma.withdraw.delete({
      where: {
        id,
      },
    });

    return {
      message: 'DELETED',
      status: 200,
    };
  }
}
