import { HttpException, Injectable } from '@nestjs/common';
import {
  AddSortNumberEditionDto,
  RemoveSortNumberEditionDto,
} from './dto/create-sort-edition.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { Title as DBTitle } from '@prisma/client';
import { Title } from 'src/titles/entities/title.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SortEditionService {
  constructor(private readonly prisma: PrismaService) {}

  async addDozen({ dozens, editionId, drawItemId }: AddSortNumberEditionDto) {
    const edition = await this.prisma.edition.findUnique({
      where: {
        id: editionId,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    const drawItem = await this.prisma.drawItems.findFirst({
      where: {
        id: drawItemId,
        edition_id: editionId,
      },
      include: {
        edition: true,
        winner: true,
      },
    });

    if (!drawItem) {
      throw new HttpException('Sorteio não existe', 400);
    }

    const sortEdition = await this.prisma.drawItems.update({
      where: {
        id: drawItemId,
      },
      data: {
        selected_dozens: dozens,
      },
    });

    const titlesWithTheseDozens = await this.prisma.title.findMany({
      where: {
        edition_id: editionId,
        dozens: { hasEvery: sortEdition.selected_dozens },
        user_id: { not: null },
        buyed_title_id: { not: null },
      },
      include: {
        user: true,
      },
    });

    const titles = await this.prisma.title.findMany({
      where: {
        edition_id: editionId,
        user_id: { not: null },
        buyed_title_id: { not: null },
      },
      include: {
        user: true,
      },
    });

    const titlesWithoutTwoDozens: DBTitle[] = [];
    const titlesWithoutOneDozens: DBTitle[] = [];

    for (const title of titles) {
      const dozens = title.dozens;

      let count = 0;

      await Promise.all(
        dozens.map((dozen) => {
          if (sortEdition.selected_dozens.includes(dozen)) {
            count++;
          }
        }),
      );

      if (count === 18) {
        titlesWithoutTwoDozens.push(title);
      }

      if (count === 19) {
        titlesWithoutOneDozens.push(title);
      }
    }

    const winnedTitlesId = titlesWithTheseDozens.map((title) => title.id);

    const winners = await this.prisma.user.findMany({
      where: {
        titles: {
          some: {
            id: { in: winnedTitlesId },
          },
        },
      },
    });

    return {
      sortEdition,
      winners: plainToInstance(User, winners),
      dozensPerOne: titlesWithoutOneDozens,
      dozensPerTwo: titlesWithoutTwoDozens,
      titlesWithTheseDozens: plainToInstance(Title, titlesWithTheseDozens),
    };
  }

  async removeDozen({ editionId, drawItemId }: RemoveSortNumberEditionDto) {
    const edition = await this.prisma.edition.findUnique({
      where: {
        id: editionId,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    const drawItem = await this.prisma.drawItems.findFirst({
      where: {
        id: drawItemId,
        edition_id: editionId,
      },
      include: {
        edition: true,
        winner: true,
      },
    });

    if (!drawItem) {
      throw new HttpException('Sorteio não existe', 400);
    }

    const sortEdition = await this.prisma.drawItems.update({
      where: {
        id: drawItemId,
      },
      data: {
        selected_dozens: [],
      },
    });

    return {
      sortEdition,
    };
  }
}
