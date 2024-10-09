import { HttpException, Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScratchCard } from './entities/scratch-card.entity';

@Injectable()
export class ScratchCardsService {
  constructor(private prisma: PrismaService) {}

  async findAllMyScratchCards(user_id: string) {
    const scratchCards = await this.prisma.scratchCard.findMany({
      where: {
        user_id,
      },
      include: {
        edition: true,
        title: true,
      },
    });

    return plainToInstance(ScratchCard, scratchCards);
  }

  async findAllNotUserScratchCards(user_id: string) {
    const scratchCards = await this.prisma.scratchCard.findMany({
      where: {
        user_id,
        winned: null,
      },
      include: {
        edition: true,
        title: true,
      },
    });

    return plainToInstance(ScratchCard, scratchCards);
  }

  async findOne(id: string) {
    const scratchCard = await this.prisma.scratchCard.findFirst({
      where: {
        id,
      },
      include: {
        edition: true,
        title: true,
      },
    });

    if (!scratchCard) {
      throw new HttpException('Raspadinha não encontrada', 404);
    }

    return plainToClass(ScratchCard, scratchCard);
  }

  async verifySuccess(card_id: string) {
    let scratchCard = await this.prisma.scratchCard.findFirst({
      where: {
        id: card_id,
      },
    });

    if (!scratchCard) {
      throw new HttpException('Raspadinha não encontrada', 404);
    }

    if (scratchCard.winned) {
      throw new HttpException('Raspadinha já foi premiada', 400);
    }

    const firstValue = scratchCard.result[0];

    if (!firstValue) {
      throw new HttpException('Raspadinha não possui valores', 400);
    }

    const isWinned = scratchCard.result.every((item) => item === firstValue);

    if (!isWinned) {
      throw new HttpException('Raspadinha não foi premiada', 400);
    }

    scratchCard = await this.prisma.scratchCard.update({
      where: {
        id: card_id,
      },
      data: {
        winned: isWinned,
      },
    });

    return scratchCard;
  }

  async verifyLoose(card_id: string) {
    let scratchCard = await this.prisma.scratchCard.findFirst({
      where: {
        id: card_id,
      },
    });

    if (!scratchCard) {
      throw new HttpException('Raspadinha não encontrada', 404);
    }

    if (scratchCard.winned) {
      throw new HttpException('Raspadinha já foi premiada', 400);
    }

    const firstValue = scratchCard.result[0];

    if (!firstValue) {
      throw new HttpException('Raspadinha não possui valores', 400);
    }

    const isWinned = scratchCard.result.every((item) => item === firstValue);

    if (isWinned) {
      throw new HttpException('Raspadinha não foi premiada', 400);
    }

    scratchCard = await this.prisma.scratchCard.update({
      where: {
        id: card_id,
      },
      data: {
        winned: isWinned,
      },
    });

    return scratchCard;
  }
}
