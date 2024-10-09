import { HttpException, Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateRandomCode } from 'src/utils/randomCode';
import { AddCreditDto } from './dto/add-credit.dto';
import { CreditHistoryService } from 'src/credit-history/credit-history.service';
import { CreateWithdrawDto } from './dto/withdraw.dto';
import { ReckoningDto } from './dto/reckoning.dto';
import { UpdateAddressSellerDto } from './dto/update-address.dto';
import { format } from 'date-fns';
import { currencyValue } from 'src/utils/currencyValue';
import { plainToInstance } from 'class-transformer';
import { Seller } from './entities/seller.entity';

@Injectable()
export class SellersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly creditHistoryService: CreditHistoryService,
  ) {}

  async create(createSellerDto: CreateSellerDto) {
    const seller = await this.prisma.user.findFirst({
      where: { id: createSellerDto.user_id },
    });

    if (!seller) {
      throw new HttpException('Usuário não existe', 400);
    }

    if (seller.code) {
      throw new HttpException('Este usuário já é um vendedor', 400);
    }

    const sellerRole = await this.prisma.role.findFirst({
      where: { name: 'SELLER' },
    });

    if (!sellerRole) {
      throw new HttpException('Cargo não existe', 400);
    }

    const randomCode = generateRandomCode(5);

    const sellerUpdate = await this.prisma.user.update({
      where: { id: createSellerDto.user_id },
      data: {
        code: randomCode,
        roles: {
          connect: {
            id: sellerRole.id,
          },
        },
      },
    });

    return sellerUpdate;
  }

  async reckoning(reckoningDto: ReckoningDto) {
    let user = await this.prisma.user.findFirst({
      where: { id: reckoningDto.user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    user = await this.prisma.user.update({
      where: { id: reckoningDto.user_id },
      data: {
        credit: user.credit_limit,
      },
    });

    return user;
  }

  async reckoningWithValue(user_id: string) {
    let user = await this.prisma.user.findFirst({
      where: { id: user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const creditToComplete = user.credit_limit - user.credit;

    if (creditToComplete <= 0) {
      throw new HttpException(
        'Este usuário já está com o limite completo',
        400,
      );
    }

    const newValue = user.value - creditToComplete;

    if (newValue <= 0) {
      throw new HttpException('Você não tem saldo suficiente', 400);
    }

    user = await this.prisma.user.update({
      where: { id: user_id },
      data: {
        credit: user.credit_limit,
        value: newValue,
      },
    });

    await this.prisma.creditHistory.create({
      data: {
        value: creditToComplete,
        date_format: format(new Date(), 'dd/MM/yyyy'),
        deposit_type: 'SALDO',
        user_id: user_id,
        type: 'DEPOSIT',
        name: 'Acerto realizado',
        description: `Você utilizou seu saldo para realizar um acerto digital no valor de ${currencyValue(
          creditToComplete,
        )}`,
        status: 'DONE',
      },
    });

    await this.prisma.valueHistory.create({
      data: {
        value: creditToComplete,
        date_format: format(new Date(), 'dd/MM/yyyy'),
        deposit_type: 'SALDO',
        user_id: user_id,
        type: 'DEPOSIT',
        name: 'Acerto realizado',
        description: `Você utilizou seu saldo para realizar um acerto digital no valor de ${currencyValue(
          creditToComplete,
        )}`,
        status: 'DONE',
      },
    });

    return user;
  }

  async withdraw(createWithdrawDto: CreateWithdrawDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: createWithdrawDto.user_id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const newValue = user.value - createWithdrawDto.value;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        value: newValue <= 0 ? 0 : newValue,
      },
    });

    const withdraw = await this.prisma.withdraw.create({
      data: {
        value: createWithdrawDto.value,
        description: createWithdrawDto.description,
        payment_form: createWithdrawDto.payment_form,
        user_id: createWithdrawDto.user_id,
        pix: createWithdrawDto.pix,
      },
    });

    return withdraw;
  }

  async addCredit({ user_id, value }: AddCreditDto) {
    let seller = await this.prisma.user.findFirst({
      where: { id: user_id, code: { not: null } },
    });

    if (!seller) {
      throw new HttpException('Este vendedor não existe', 400);
    }

    seller = await this.prisma.user.update({
      where: { id: user_id },
      data: {
        value: seller.value + value,
      },
    });

    await this.creditHistoryService.create({
      deposit_type: 'PIX',
      description: `Depósito de ${value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`,
      status: 'DONE',
      value,
      user_id: seller.id,
      name: null,
    });

    return seller;
  }

  async findAll(document?: string, page = 1, limit = 10) {
    const sellers = await this.prisma.user.findMany({
      where: {
        code: { not: null },
        doccument: document,
        roles: {
          some: {
            name: 'SELLER',
          },
        },
      },
      include: {
        selled_titles: true,
        credit_history: true,
        value_history: true,
        withdraws: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const sellersCount = await this.prisma.user.count({
      where: {
        code: { not: null },
        doccument: document,
        roles: {
          some: {
            name: 'SELLER',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return {
      totalPages: Math.ceil(sellersCount / limit),
      sellers: plainToInstance(Seller, sellers),
    };
  }

  async findAllClients(seller_id: string) {
    const clients = await this.prisma.user.findMany({
      where: {
        buyed_titles: {
          some: {
            selled_title: {
              seller_id: seller_id,
            },
          },
        },
      },
    });

    return clients;
  }

  async findOneClient(id: string, seller_id: string) {
    const client = await this.prisma.user.findFirst({
      where: {
        id,
        buyed_titles: {
          some: {
            selled_title: {
              seller_id: seller_id,
            },
          },
        },
      },
    });

    return client;
  }

  async findOne(id: string) {
    const seller = await this.prisma.user.findFirst({
      where: { id: id, code: { not: null } },
    });

    if (!seller) {
      throw new HttpException('Vendedor não existe', 400);
    }

    return seller;
  }

  async update(id: string, updateSellerDto: UpdateSellerDto) {
    let seller = await this.prisma.user.findFirst({
      where: { id, code: { not: null } },
    });

    if (!seller) {
      throw new HttpException('Vendedor não existe', 400);
    }

    seller = await this.prisma.user.update({
      where: { id },
      data: {
        credit: updateSellerDto?.credit,
        value: updateSellerDto?.value,
        associated_to: updateSellerDto?.associated_to,
      },
    });

    return seller;
  }

  async updateAddress(
    {
      address,
      cep,
      city,
      neighborhood,
      residence_number,
      uf,
    }: UpdateAddressSellerDto,
    user_id: string,
  ) {
    let seller = await this.prisma.user.findFirst({
      where: { id: user_id },
    });

    if (!seller) {
      throw new HttpException('Vendedor não existe', 400);
    }

    seller = await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        address,
        cep,
        neighborhood,
        uf,
        city,
        residence_number,
      },
    });

    return seller;
  }

  async remove(id: string) {
    let seller = await this.prisma.user.findFirst({
      where: { id, code: { not: null } },
    });

    if (!seller) {
      throw new HttpException('Vendedor não existe', 400);
    }

    const sellerRole = await this.prisma.role.findFirst({
      where: { name: 'SELLER' },
    });

    if (!sellerRole) {
      throw new HttpException('Cargo não existe', 400);
    }

    seller = await this.prisma.user.update({
      where: { id },
      data: {
        roles: {
          disconnect: {
            id: sellerRole.id,
          },
        },
      },
    });

    return seller;
  }
}
