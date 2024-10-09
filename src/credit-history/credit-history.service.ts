import { HttpException, Injectable } from '@nestjs/common';
import { CreateCreditHistoryDto } from './dto/create-credit-history.dto';
import { UpdateCreditHistoryDto } from './dto/update-credit-history.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { groupItems } from 'src/utils/groupItems';

@Injectable()
export class CreditHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCreditHistoryDto: CreateCreditHistoryDto) {
    const history = await this.prisma.creditHistory.create({
      data: {
        name: createCreditHistoryDto.name,
        description: createCreditHistoryDto.description,
        value: createCreditHistoryDto.value,
        deposit_type: createCreditHistoryDto.deposit_type,
        status: createCreditHistoryDto.status,
        user_id: createCreditHistoryDto.user_id,
      },
    });

    return history;
  }

  async findAll(user_id: string, date?: string) {
    let creditHistory = await this.prisma.creditHistory.findMany({
      where: { user_id, deleted: false },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (date) {
      creditHistory = await this.prisma.creditHistory.findMany({
        where: { user_id, deleted: false, created_at: { gte: new Date(date) } },
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    const commissionHistory = await this.prisma.creditHistory.findMany({
      where: { deleted: false, type: 'COMMISSION' },
    });

    const commission = commissionHistory.reduce(
      (acc, history) => acc + history.value,
      0,
    );

    const history = groupItems(creditHistory, 'date_format');

    const groupArrays = Object.keys(history).map((dateValue) => {
      return {
        title: dateValue,
        data: history[dateValue] ?? [],
      };
    });

    return { history: groupArrays, commission };
  }

  async findOne(id: string, user_id: string) {
    const creditHistory = await this.prisma.creditHistory.findFirst({
      where: { id },
    });

    if (creditHistory?.user_id !== user_id) {
      throw new HttpException('Este histórico não é seu', 400);
    }

    if (!creditHistory) {
      throw new HttpException(
        'Houve um erro ao procurar esta opção, verifique se ela existe',
        400,
      );
    }

    return creditHistory;
  }

  async update(id: string, updateCreditHistoryDto: UpdateCreditHistoryDto) {
    let creditHistory = await this.prisma.creditHistory.findFirst({
      where: { id },
    });

    if (!creditHistory) {
      throw new HttpException(
        'Houve um erro ao procurar esta opção, verifique se ela existe',
        400,
      );
    }

    creditHistory = await this.prisma.creditHistory.update({
      where: { id },
      data: {
        name: updateCreditHistoryDto.name,
        description: updateCreditHistoryDto.description,
        deposit_type: updateCreditHistoryDto.deposit_type,
        status: updateCreditHistoryDto.status,
        value: updateCreditHistoryDto.value,
      },
    });

    return creditHistory;
  }

  async remove(id: string) {
    let creditHistory = await this.prisma.creditHistory.findFirst({
      where: { id },
    });

    if (!creditHistory) {
      throw new HttpException(
        'Houve um erro ao procurar esta opção, verifique se ela existe',
        400,
      );
    }

    creditHistory = await this.prisma.creditHistory.delete({
      where: { id },
    });

    return creditHistory;
  }
}
