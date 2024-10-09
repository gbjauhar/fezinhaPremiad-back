import { HttpException, Injectable } from '@nestjs/common';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BuyTitleDto } from './dto/buy-title.dto';
import { IbgeService } from 'src/ibge/ibge.service';
import { TitlesUseCase } from './usecases/titles.usecase';

@Injectable()
export class TitlesService {
  constructor(
    private readonly prisma: PrismaService,
    private ibgeService: IbgeService,
    private titlesUseCase: TitlesUseCase,
  ) {}

  async create(createTitleDto: CreateTitleDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: createTitleDto.user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const title = await this.prisma.title.create({
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

  async createMany(createTitleDto: CreateTitleDto[]) {
    const mappedTitles = createTitleDto.map((title) => ({
      name: title.name,
      dozens: title.dozens,
      bar_code: title.bar_code,
      qr_code: title.qr_code,
      user_id: title.user_id,
      chances: title.chances,
      value: title.value,
    }));

    const titles = await this.prisma.title.createMany({
      data: mappedTitles,
    });

    return titles;
  }

  async createManyBaseTitles(createTitleDto: CreateTitleDto[]) {
    const mappedTitles = createTitleDto.map((title) => ({
      name: title?.name,
      dozens: title?.dozens,
      bar_code: title?.bar_code,
      qr_code: title?.qr_code,
      user_id: title?.user_id,
      chances: title?.chances,
      value: title?.value,
    }));

    const titles = await this.prisma.baseTitle.createMany({
      data: mappedTitles,
    });

    return titles;
  }

  async findAll(page = 1, limit = 10) {
    const titles = await this.prisma.title.findMany({
      where: {
        user_id: null,
        buyed_title_id: null,
      },
      include: {
        edition: {
          include: {
            draw_items: true,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return titles;
  }

  async findOne(id: string) {
    const title = await this.prisma.title.findFirst({
      where: { id },
    });

    return title;
  }

  async getTotalUnusedTitles() {
    const total = await this.prisma.title.count({
      where: {
        user_id: null,
        buyed_title_id: null,
      },
    });

    return total;
  }

  async getRandomNumberOfTitles(numberOfTitles: number) {
    const titles = await this.prisma.title.findMany({
      where: {
        user_id: null,
        buyed_title_id: null,
      },
      take: numberOfTitles,
    });

    return titles;
  }

  async buyTitle(buyTitleDto: BuyTitleDto) {
    const user = await this.prisma.user.findFirst({
      where: { doccument: buyTitleDto.user_doccument },
      include: {
        roles: true,
      },
    });

    const seller = buyTitleDto.code
      ? await this.prisma.user.findFirst({
          where: {
            code: buyTitleDto.code,
          },
        })
      : undefined;

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    if (!user.uf || !user.city) {
      throw new HttpException(
        'Cidade ou estado do usuário não preenchida',
        400,
      );
    }

    const isSeller =
      !!seller ||
      user.roles.find(
        (role) => role.name === 'SELLER' || role.name === 'DISTRIBUTOR',
      );

    if (isSeller) {
      return await this.titlesUseCase.buyTitleAsSeller(
        buyTitleDto,
        user,
        this.ibgeService,
      );
    } else {
      return await this.titlesUseCase.buyTitleAsClient(
        buyTitleDto,
        user,
        this.ibgeService,
      );
    }
  }

  async update(id: string, updateTitleDto: UpdateTitleDto) {
    const titleExist = await this.prisma.title.findFirst({
      where: { id },
    });

    if (!titleExist) {
      throw new HttpException('Titulo não encontrado', 400);
    }

    const title = await this.prisma.title.update({
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
