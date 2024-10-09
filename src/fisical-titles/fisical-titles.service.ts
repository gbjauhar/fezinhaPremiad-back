import { HttpException, Injectable } from '@nestjs/common';
import { CreateFisicalTitleDto } from './dto/create-fisical-title.dto';
import { UpdateFisicalTitleDto } from './dto/update-fisical-title.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BuyTitleDto } from './dto/buy-title.dto';
import { getPercentage } from 'src/utils/percentage';
import { Status } from '@prisma/client';
import { format } from 'date-fns';

@Injectable()
export class FisicalTitlesService {
  constructor(private prisma: PrismaService) {}

  async create(createTitleDto: CreateFisicalTitleDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: createTitleDto.user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const title = await this.prisma.fisicalTitle.create({
      data: {
        name: createTitleDto.name,
        dozens: createTitleDto.dozens,
        bar_code: createTitleDto.bar_code,
        qr_code: createTitleDto.qr_code,
        user_id: createTitleDto.user_id,
        chances: createTitleDto.chances,
        value: createTitleDto.value,
      },
    });

    return title;
  }

  async findAll() {
    const titles = await this.prisma.fisicalTitle.findMany({
      where: {
        user_id: null,
      },
      include: {
        edition: {
          include: {
            draw_items: true,
          },
        },
      },
    });

    return titles;
  }

  async findOne(id: string) {
    const title = await this.prisma.fisicalTitle.findFirst({
      where: { id },
    });

    return title;
  }

  async findByCode(code: string) {
    const title = await this.prisma.fisicalTitle.findFirst({
      where: { OR: [{ qr_code: code }, { bar_code: code }] },
      include: {
        edition: true,
      },
    });

    if (!title) {
      throw new HttpException(`Título com código ${code} não encontrado`, 400);
    }

    const newCode = title?.edition?.name
      ? title?.edition?.name + title.bar_code
      : title.bar_code;

    return {
      ...title,
      bar_code: newCode,
    };
  }

  async findByRange(start_code: string, end_code: string) {
    const edition = await this.prisma.edition.findFirst({
      where: { status: 'OPEN' },
    });

    const startCode = edition?.name ? edition.name + start_code : start_code;
    const endCode = edition?.name ? edition.name + end_code : end_code;

    const firstTitle = await this.prisma.fisicalTitle.findFirst({
      where: {
        OR: [
          { qr_code: start_code },
          { bar_code: start_code },
          { qr_code: startCode },
          { bar_code: startCode },
        ],
      },
      include: {
        edition: true,
      },
    });

    const lastTitle = await this.prisma.fisicalTitle.findFirst({
      where: {
        OR: [
          { qr_code: endCode },
          { bar_code: endCode },
          { qr_code: end_code },
          { bar_code: end_code },
        ],
      },
      include: {
        edition: true,
      },
    });

    if (!firstTitle || !lastTitle) {
      throw new HttpException(`Títulos não encontrados`, 400);
    }

    const titles = await this.prisma.$queryRaw`
       SELECT
          ft.*,
          to_jsonb(E) AS edition
        FROM
          fisical_titles ft
        LEFT JOIN editions E ON ft."editionId" = E.id
        WHERE
          ft.name::numeric >= ${Number(firstTitle.name)}
          AND ft.name::numeric <= ${Number(lastTitle.name)};
    `;

    return titles;
  }

  async buyTitle(buyTitleDto: BuyTitleDto) {
    const titles = await this.prisma.fisicalTitle.findMany({
      where: { id: { in: buyTitleDto.titles } },
    });

    if (!titles) {
      throw new HttpException('Título já existe', 400);
    }

    const alreadyBuyedTitle = titles.filter(
      (title) => title.buyed_title_id || title.user_id,
    );

    if (alreadyBuyedTitle.length > 0) {
      throw new HttpException(
        {
          message: 'Esses títulos já foram comprados',
          titles: alreadyBuyedTitle,
        },
        400,
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id: buyTitleDto.user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    await this.prisma.fisicalTitle.updateMany({
      where: { id: { in: buyTitleDto.titles } },
      data: {
        updated_at: new Date(),
        user_id: user.id,
      },
    });

    const ids = titles.map((title) => ({ id: title.id }));

    const buyedTitles = await this.prisma.buyedTitles.create({
      data: {
        name: 'Vender Título de Capitalização',
        description: 'Vender Título de Capitalização',
        payment_form: buyTitleDto.payment_form,
        user_id: user.id,
        titles: {
          connect: ids,
        },
      },
    });

    if (buyTitleDto.code) {
      const seller = await this.prisma.user.findFirst({
        where: { code: buyTitleDto.code },
      });

      if (!seller) {
        throw new HttpException('Vendedor não existe', 400);
      }

      const titlesTotalValues = titles.reduce(
        (oldValue, newValue) => oldValue + newValue.value,
        0,
      );

      const comissionValue = getPercentage(titlesTotalValues, 10); // get 10% of the value

      // Adiciona 10% de comissão ao vendedor
      await this.prisma.user.update({
        where: { id: seller.id },
        data: { value: seller.value + comissionValue, updated_at: new Date() },
      });

      // Adiciona a venda ao histórico do vendedor
      await this.prisma.selledTitles.create({
        data: {
          name: 'Vender Título de Capitalização',
          description: 'Vender Título de Capitalização',
          reference: '',
          payment_form: buyTitleDto.payment_form,
          seller_id: seller.id,
          buyed_titles_id: buyedTitles.id,
        },
      });

      // Adiciona no histórico o valor de comissão
      await this.prisma.valueHistory.create({
        data: {
          description: `Você recebeu uma comissão de ${comissionValue.toLocaleString(
            'pt-BR',
            { style: 'currency', currency: 'BRL' },
          )}`,
          value: comissionValue,
          deposit_type: buyTitleDto.payment_form,
          status: Status.DONE,
          type: 'COMMISSION',
          user_id: seller.id,
          date_format: format(new Date(), 'dd/MM/yyyy'),
        },
      });
    }

    return titles;
  }

  async update(id: string, updateTitleDto: UpdateFisicalTitleDto) {
    const titleExist = await this.prisma.fisicalTitle.findFirst({
      where: { id },
    });

    if (!titleExist) {
      throw new HttpException('Titulo não encontrado', 400);
    }

    const title = await this.prisma.fisicalTitle.update({
      data: {
        ...updateTitleDto,
        updated_at: new Date(),
      },
      where: { id },
    });

    return title;
  }

  async remove(id: string) {
    return `This action removes a #${id} title`;
  }
}
