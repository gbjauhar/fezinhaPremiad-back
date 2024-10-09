import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateValueHistoryDto } from './dto/create-value-history.dto';
import { UpdateValueHistoryDto } from './dto/update-value-history.dto';
import { groupItems } from 'src/utils/groupItems';
import { subDays } from 'date-fns';

@Injectable()
export class ValueHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createValueHistoryDto: CreateValueHistoryDto) {
    const history = await this.prisma.valueHistory.create({
      data: {
        name: createValueHistoryDto.name,
        description: createValueHistoryDto.description,
        value: createValueHistoryDto.value,
        deposit_type: createValueHistoryDto.deposit_type,
        status: createValueHistoryDto.status,
        user_id: createValueHistoryDto.user_id,
      },
    });

    return history;
  }

  async findAll(user_id: string, date?: string) {
    let valueHistory = await this.prisma.valueHistory.findMany({
      where: { user_id, deleted: false },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (date) {
      valueHistory = await this.prisma.valueHistory.findMany({
        where: { user_id, deleted: false, created_at: { gte: new Date(date) } },
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    const commissionHistory = await this.prisma.valueHistory.findMany({
      where: { deleted: false, type: 'COMMISSION' },
    });

    const commission = commissionHistory.reduce(
      (acc, history) => acc + history.value,
      0,
    );

    const history = groupItems(valueHistory, 'date_format');

    const groupArrays = Object.keys(history).map((dateValue) => {
      return {
        title: dateValue,
        data: history[dateValue] ?? [],
      };
    });

    return { history: groupArrays, commission };
  }

  async findAllEarnings(user_id: string, date?: string) {
    const atualDate = new Date();
    const thirtyDaysAgo = subDays(atualDate, 30);

    let valueHistory = await this.prisma.valueHistory.findMany({
      where: {
        user_id,
        deleted: false,
        type: 'COMMISSION',
        created_at: { gte: thirtyDaysAgo },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (date) {
      valueHistory = await this.prisma.valueHistory.findMany({
        where: {
          user_id,
          deleted: false,
          created_at: { gte: new Date(date) },
          type: 'COMMISSION',
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    }

    const commission = valueHistory.reduce(
      (acc, history) => acc + parseFloat(history.value.toFixed(2)),
      0,
    );

    const history = groupItems(valueHistory, 'date_format');

    const groupArrays = Object.keys(history).map((dateValue) => {
      return {
        title: dateValue,
        data: history[dateValue] ?? [],
      };
    });

    return { history: groupArrays, commission };
  }

  async findOne(id: string, user_id: string) {
    const valueHistory = await this.prisma.valueHistory.findFirst({
      where: { id },
    });

    if (valueHistory?.user_id !== user_id) {
      throw new HttpException('Este histórico não é seu', 400);
    }

    if (!valueHistory) {
      throw new HttpException(
        'Houve um erro ao procurar esta opção, verifique se ela existe',
        400,
      );
    }

    return valueHistory;
  }

  async update(id: string, updateValueHistoryDto: UpdateValueHistoryDto) {
    let valueHistory = await this.prisma.valueHistory.findFirst({
      where: { id },
    });

    if (!valueHistory) {
      throw new HttpException(
        'Houve um erro ao procurar esta opção, verifique se ela existe',
        400,
      );
    }

    valueHistory = await this.prisma.valueHistory.update({
      where: { id },
      data: {
        name: updateValueHistoryDto.name,
        description: updateValueHistoryDto.description,
        deposit_type: updateValueHistoryDto.deposit_type,
        status: updateValueHistoryDto.status,
        value: updateValueHistoryDto.value,
      },
    });

    return valueHistory;
  }

  async remove(id: string) {
    let valueHistory = await this.prisma.valueHistory.findFirst({
      where: { id },
    });

    if (!valueHistory) {
      throw new HttpException(
        'Houve um erro ao procurar esta opção, verifique se ela existe',
        400,
      );
    }

    valueHistory = await this.prisma.valueHistory.delete({
      where: { id },
    });

    return valueHistory;
  }
}
