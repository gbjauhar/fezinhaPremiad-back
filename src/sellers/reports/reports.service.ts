import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindCommissionsDto } from './dto/find-commissions.dto';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { FindClientSellsDto } from './dto/find-client-sells.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { findUserSalesBySeller } from '../queries/find-sales-by-client';
import {
  FindUserSalesBySellerDto,
  FindUserSalesBySellerQueryDto,
} from '../dto/find-users-sales-by-seller.dto';
import { ClientSalesReport } from '../entities/client-sales-report';

@Injectable()
export class SellersReportsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAllCommissions(findCommissionsDto?: FindCommissionsDto) {
    const atualDate = new Date();
    const startDate = findCommissionsDto?.initial_date ?? subDays(atualDate, 7);
    const endDate = findCommissionsDto?.end_date ?? atualDate;

    const commissions = await this.prisma.valueHistory.findMany({
      where: {
        type: 'COMMISSION',
        created_at: {
          gte: startDate,
          lte: endDate,
        },
        deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const totalValue = commissions.reduce(
      (acc, commission) => acc + commission.value,
      0,
    );

    return { totalValue, commissions };
  }

  async findAllSalesGroupByClient({
    seller_id,
    startDate,
    endDate,
    limit = 10,
    offset = 0,
  }: FindUserSalesBySellerDto) {
    const today = startOfDay(new Date());
    const lastWeek = subDays(today, 7);

    const findAllClients = await this.prisma.$queryRaw<ClientSalesReport>(
      findUserSalesBySeller({
        seller_id,
        endDate: endDate || today,
        startDate: startDate || lastWeek,
        offset,
        limit,
      }),
    );

    return findAllClients;
  }

  async findAllSellsByClient({ user_id }: FindClientSellsDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new HttpException('Esse usuário não existe', 404);
    }

    const keys = Object.keys(user);

    const userSelect = {};
    keys.forEach((key) => {
      userSelect[key] = true;
    });

    const sells = await this.prisma.selledTitles.findMany({
      where: {
        buyed_titles: {
          user_id,
        },
      },
      include: {
        buyed_titles: {
          include: {
            fisical_titles: true,
            titles: true,
            user: {
              select: {
                ...userSelect,
                password: false,
              },
            },
          },
        },
      },
    });

    const totalValue = sells.reduce(
      (acc, sell) => acc + sell.buyed_titles.total,
      0,
    );

    return { totalValue, sells };
  }

  async findAllWinnedEditions({
    startDate,
    endDate,
    limit = 10,
    offset = 0,
  }: FindUserSalesBySellerQueryDto) {
    const today = startOfDay(new Date());
    const lastWeek = subDays(today, 7);

    const editions = await this.prisma.edition.findMany({
      where: {
        OR: [{ status: 'OPEN' }, { status: 'FINISHED' }],
        winners: {
          some: {
            id: { not: undefined },
          },
        },
        created_at: { gte: startDate || lastWeek, lte: endDate || today },
      },
      include: {
        winners: true,
        draw_items: true,
      },
      take: limit,
      skip: offset * limit,
    });

    return editions;
  }
}
