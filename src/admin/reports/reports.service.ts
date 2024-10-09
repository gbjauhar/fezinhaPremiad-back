import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { stringify } from 'csv-stringify';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSales() {
    const sales = await this.prisma.buyedTitles.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        selled_title: true,
        titles: true,
        user: true,
      },
    });

    const filename = 'saved_from_db.csv';
    const writableStream = fs.createWriteStream(filename);

    const columns = ['name', 'description'];

    const stringifier = stringify({ header: false, columns: columns });
    sales.map((sale) => {
      stringifier.write(sale);
    });

    stringifier.pipe(writableStream);
    console.log('Finished writing data');

    return sales;
  }

  async getAllSalesFromSeller(seller_id: string) {
    const sales = await this.prisma.selledTitles.findMany({
      where: { seller_id },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        seller: true,
        buyed_titles: {
          include: {
            titles: true,
            user: true,
          },
        },
      },
    });

    return sales;
  }

  async getSalesCount(edition: string) {
    const atualEdition = await this.prisma.edition.findFirst({
      where: {
        name: edition,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    if (!atualEdition) {
      throw new HttpException('Esta edição não existe', 400);
    }

    const oldEditionsDb = await this.prisma.edition.findMany({
      where: {
        id: { not: atualEdition.id },
        created_at: {
          lte: atualEdition.created_at,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        BuyedTitles: true,
      },
      take: 3,
    });

    const totalSalesCount = await this.prisma.selledTitles.count({
      where: {
        buyed_titles: {
          edition: {
            name: edition,
          },
        },
      },
    });

    const pendingSales = await this.prisma.selledTitles.count({
      where: {
        buyed_titles: {
          edition: {
            name: edition,
          },
        },
        status: 'PENDING',
      },
    });

    const oldSales = oldEditionsDb.map((edition) => {
      return {
        edition: edition.name,
        totalSales: edition.BuyedTitles.length,
      };
    });

    return {
      totalSalesCount,
      pendingSales,
      oldSales,
    };
  }
}
