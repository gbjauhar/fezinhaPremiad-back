import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { Title } from 'src/titles/entities/title.entity';

@Injectable()
export class BuyedTitlesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const titles = await this.prisma.title.findMany({
      where: {
        user_id: { not: null },
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        user: true,
        edition: true,
        buyed_title: {
          include: {
            selled_title: {
              include: {
                seller: true,
              },
            },
          },
        },
      },
    });

    return plainToInstance(Title, titles);
  }

  async findAllByEdition(edition_id: string) {
    const titles = await this.prisma.title.findMany({
      where: {
        user_id: { not: null },
        edition_id,
      },
      orderBy: {
        name: 'asc',
      },
      include: {
        user: true,
        edition: true,
        buyed_title: {
          include: {
            selled_title: {
              include: {
                seller: true,
              },
            },
          },
        },
      },
    });

    return plainToInstance(Title, titles);
  }

  async findAllMy(userId: string) {
    const buyedTitles = await this.prisma.buyedTitles.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'asc',
      },
      include: {
        edition: true,
        fisical_titles: true,
        selled_title: true,
        titles: true,
      },
    });

    return buyedTitles;
  }

  async findOne(id: number) {
    return `This action returns a #${id} buyedTitle`;
  }
}
