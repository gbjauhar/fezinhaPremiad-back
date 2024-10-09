import { HttpException, Injectable } from '@nestjs/common';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VinculateDistributorDto } from './dto/vinculate-distributor.dto';
import { Role } from 'src/roles/enums/role.enum';
import { plainToInstance } from 'class-transformer';
import { Distributor } from './entities/distributor.entity';

@Injectable()
export class DistributorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDistributorDto: CreateDistributorDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: createDistributorDto.user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const distributorRole = await this.prisma.role.findFirst({
      where: { name: 'DISTRIBUTOR' },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        updated_at: new Date(),
        roles: {
          connect: {
            id: distributorRole.id,
          },
        },
      },
    });

    return user;
  }

  async vinculate(
    { distributor_code }: VinculateDistributorDto,
    seller_id: string,
  ) {
    const distributor = await this.prisma.user.findFirst({
      where: {
        code: distributor_code,
        roles: {
          some: {
            name: Role.DISTRIBUTOR,
          },
        },
      },
    });

    if (!distributor) {
      throw new HttpException('Distribuidor não existe', 400);
    }

    await this.prisma.user.update({
      where: { id: seller_id },
      data: {
        associated_to: distributor.email,
      },
    });

    return distributor;
  }

  async findAll(document?: string, page = 1, limit = 10) {
    const distributors = await this.prisma.user.findMany({
      where: {
        code: { not: null },
        doccument: document,
        roles: {
          some: {
            name: 'DISTRIBUTOR',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const distributorsCount = await this.prisma.user.count({
      where: {
        code: { not: null },
        doccument: document,
        roles: {
          some: {
            name: 'DISTRIBUTOR',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      totalPages: Math.ceil(distributorsCount / limit),
      distributors: plainToInstance(Distributor, distributors),
    };
  }

  async remove(id: string) {
    const distributor = await this.prisma.user.findMany({
      where: {
        id,
        code: { not: null },
        roles: {
          some: {
            name: 'DISTRIBUTOR',
          },
        },
      },
    });

    return distributor;
  }
}
