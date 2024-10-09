import { HttpException, Injectable } from '@nestjs/common';
import { CreateDrawItemDto } from './dto/create-draw-item.dto';
import { UpdateDrawItemDto } from './dto/update-draw-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { addDays } from 'date-fns';
import { FileUploadService } from 'src/s3/s3.service';

@Injectable()
export class DrawItemsService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  async create(
    createDrawItemDto: CreateDrawItemDto,
    file?: Express.Multer.File,
  ) {
    if (file) {
      const { Location: file_url } = await this.fileUploadService.uploadFile(
        file,
      );

      const drawItem = await this.prisma.drawItems.create({
        data: {
          edition_id: createDrawItemDto.edition_id,
          name: createDrawItemDto.name,
          image: file_url,
          value: !!createDrawItemDto.value
            ? Number(createDrawItemDto.value)
            : null,
        },
        include: {
          edition: true,
        },
      });

      return drawItem;
    }

    const drawItem = await this.prisma.drawItems.create({
      data: {
        edition_id: createDrawItemDto.edition_id,
        name: createDrawItemDto.name,
        value: Number(createDrawItemDto.value),
      },
      include: {
        edition: true,
      },
    });

    return drawItem;
  }

  async findAllByEditionId(edition_id: string) {
    const drawItems = await this.prisma.drawItems.findMany({
      where: {
        edition_id: edition_id,
        edition: {
          status: 'OPEN',
        },
      },
      include: {
        edition: {
          include: {
            titles: true,
          },
        },
      },
    });

    return drawItems;
  }

  findAll() {
    const today = new Date();
    const dateLimit = addDays(today, 7);

    const drawItems = this.prisma.drawItems.findMany({
      where: {
        edition: {
          status: { not: 'CLOSED' },
          draw_date: { lte: dateLimit },
        },
      },
      include: {
        edition: {
          include: {
            titles: true,
          },
        },
      },
    });

    return drawItems;
  }

  findOne(id: string) {
    const drawItem = this.prisma.drawItems.findFirst({
      where: {
        id: id,
      },
      include: {
        edition: {
          include: {
            titles: true,
          },
        },
      },
    });

    if (!drawItem) {
      throw new HttpException('Sorteios não encontrados', 404);
    }

    return drawItem;
  }

  update(id: string, updateDrawItemDto: UpdateDrawItemDto) {
    let drawItem = this.prisma.drawItems.findFirst({
      where: {
        id: id,
      },
    });

    if (!drawItem) {
      throw new HttpException('Sorteios não encontrados', 404);
    }

    drawItem = this.prisma.drawItems.update({
      where: {
        id: id,
      },
      data: {
        edition_id: updateDrawItemDto.edition_id,
        name: updateDrawItemDto.name,
        value: Number(updateDrawItemDto.value),
      },
    });

    return drawItem;
  }

  remove(id: string) {
    let drawItem = this.prisma.drawItems.findFirst({
      where: {
        id: id,
      },
    });

    if (!drawItem) {
      throw new HttpException('Sorteios não encontrados', 404);
    }

    drawItem = this.prisma.drawItems.delete({
      where: {
        id: id,
      },
    });

    return drawItem;
  }
}
