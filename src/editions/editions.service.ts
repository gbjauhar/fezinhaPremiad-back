import { HttpException, Injectable } from '@nestjs/common';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateManyEditionsDto } from './dto/update-many.dto';
import { FileUploadService } from 'src/s3/s3.service';
import { getFilesS3 } from './helper/getFileS3';

@Injectable()
export class EditionsService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileUploadService,
  ) {}

  async create(createEditionDto: CreateEditionDto, file?: Express.Multer.File) {
    const editionAlreadyExists = await this.prisma.edition.findFirst({
      where: {
        name: createEditionDto.name,
      },
    });

    if (editionAlreadyExists) {
      throw new HttpException('Edição já existe', 400);
    }

    const { image_key, image_url } = await getFilesS3(this.fileService, file);

    const titles = await this.prisma.baseTitle.findMany({
      where: {
        AND: [
          { name: { gte: createEditionDto.initial_title } },
          { name: { lte: createEditionDto.end_title } },
        ],
      },
    });

    const titlesAlreadyExists = await this.prisma.title.findMany({
      where: {
        name: {
          in: titles.map((title) => title.name),
        },
      },
    });

    const notExistsBaseTitle = await this.prisma.baseTitle.findMany({
      where: {
        AND: [
          { name: { gte: createEditionDto.initial_title } },
          { name: { lte: createEditionDto.end_title } },
        ],
        NOT: {
          name: {
            in: titlesAlreadyExists.map((title) => title.name),
          },
        },
      },
    });

    if (titlesAlreadyExists?.length && titlesAlreadyExists.length > 0) {
      await this.prisma.title.updateMany({
        where: {
          id: {
            in: titlesAlreadyExists.map((title) => title.id),
          },
        },
        data: {
          value: createEditionDto.value,
        },
      });
    }

    const edition = await this.prisma.edition.create({
      data: {
        name: createEditionDto.name,
        draw_date: createEditionDto.draw_date,
        order: createEditionDto.order,
        status: createEditionDto.status,
        image_url,
        image_key,
        titles: {
          connect: titlesAlreadyExists.map((title) => ({
            id: title.id,
          })),
          createMany: {
            data: notExistsBaseTitle.map((title) => ({
              name: title.name,
              dozens: title.dozens,
              bar_code: title.bar_code,
              qr_code: title.qr_code,
              chances: title.chances,
              value: createEditionDto.value,
            })),
          },
        },
      },
    });

    return edition;
  }

  async findAll() {
    const editions = await this.prisma.edition.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    return editions;
  }

  async findAllDrawItems() {
    const drawItems = await this.prisma.drawItems.findMany({
      where: {
        edition: {
          status: 'OPEN',
        },
      },
      orderBy: {
        created_at: 'asc',
      },
      include: {
        edition: {
          include: {
            titles: true,
            fisical_titles: true,
            winners: true,
          },
        },
      },
    });

    return drawItems;
  }

  async findOne(id: string) {
    const edition = await this.prisma.edition.findFirst({
      where: { id },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    return edition;
  }

  async update(
    id: string,
    updateEditionDto: UpdateEditionDto,
    file?: Express.Multer.File,
  ) {
    let edition = await this.prisma.edition.findFirst({
      where: { id },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    if (edition.image_url) {
      await this.fileService.deleteFile(edition.image_key);
    }

    const titles = await this.prisma.baseTitle.findMany({
      where: {
        AND: [
          { name: { gte: updateEditionDto.initial_title } },
          { name: { lte: updateEditionDto.end_title } },
        ],
      },
    });

    const titlesAlreadyExists = await this.prisma.title.findMany({
      where: {
        name: {
          in: titles.map((title) => title.name),
        },
      },
    });

    const notExistsBaseTitle = await this.prisma.baseTitle.findMany({
      where: {
        AND: [
          { name: { gte: updateEditionDto.initial_title } },
          { name: { lte: updateEditionDto.end_title } },
        ],
        NOT: {
          name: {
            in: titlesAlreadyExists.map((title) => title.name),
          },
        },
      },
    });

    const { image_key, image_url } = await getFilesS3(this.fileService, file);

    edition = await this.prisma.edition.update({
      where: { id },
      data: {
        name: updateEditionDto.name,
        draw_date: updateEditionDto.draw_date,
        order: updateEditionDto.order,
        status: updateEditionDto.status,
        image_url,
        image_key,
        titles: {
          connect: titlesAlreadyExists.map((title) => ({
            id: title.id,
          })),
          createMany: {
            data: notExistsBaseTitle.map((title) => ({
              name: title.name,
              dozens: title.dozens,
              bar_code: title.bar_code,
              qr_code: title.qr_code,
              chances: title.chances,
              value: updateEditionDto.value,
            })),
          },
        },
      },
      include: {
        titles: {
          where: {
            user_id: null,
          },
        },
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    return edition;
  }

  async updateMany(editions: UpdateManyEditionsDto['editions']) {
    for (const receivedEdition of editions) {
      const edition = await this.prisma.edition.findFirst({
        where: { id: receivedEdition.id },
        include: {
          titles: true,
          fisical_titles: true,
        },
      });

      if (!edition) {
        throw new HttpException('Edição não existe', 400);
      }

      await this.prisma.edition.update({
        where: { id: receivedEdition.id },
        data: {
          name: receivedEdition.name,
          draw_date: receivedEdition.draw_date,
          order: receivedEdition.order,
        },
      });
    }

    return null;
  }

  async remove(id: string) {
    const edition = await this.prisma.edition.findFirst({
      where: { id },
      include: {
        titles: true,
        fisical_titles: true,
      },
    });

    if (!edition) {
      throw new HttpException('Edição não existe', 400);
    }

    await this.prisma.edition.delete({
      where: { id },
    });

    await this.prisma.title.deleteMany({
      where: {
        edition_id: id,
        buyed_title_id: { not: null },
      },
    });

    return {
      message: 'Deletado',
      status: 200,
    };
  }
}
