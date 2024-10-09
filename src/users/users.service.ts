import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/reset-password.dto';
import { generateRandomCode } from 'src/utils/randomCode';
import WelcomeEmail from '../../react-email-starter/emails/welcome';
import { SmsService } from 'src/sms/sms.service';
import { MailService } from 'src/mail/mail.service';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly smsSevice: SmsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { doccument: createUserDto.doccument },
        ],
      },
    });

    if (user) {
      throw new HttpException('User already exists', 400);
    }

    if (createUserDto.invited) {
      const code = generateRandomCode(6);

      const hashedPassword = await bcrypt.hash(
        code,
        Number(process.env.HASH_PASSWORD),
      );

      user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          doccument: createUserDto.doccument,
          cel: createUserDto.cel,
          password: hashedPassword,
          value: 0,
          address: createUserDto.address,
          cep: createUserDto.cep,
          city: createUserDto.city,
          neighborhood: createUserDto.neighborhood,
          complement: createUserDto.complement,
          uf: createUserDto.uf,
          country: createUserDto.country,
          residence_number: createUserDto.residence_number,
        },
      });

      await this.mailService.addToQueue({
        component: WelcomeEmail({
          code,
          link: 'https://fezinhapremiada.com.br/',
        }),
        subject: 'Bem-vindo ao Fezinha Premiada!',
        to: user.email,
      });

      await this.smsSevice.addToQueue(
        user.cel,
        `Bem-vindo ao Fezinha Premiada!\nVocê realizou sua compra com um vendedor e criou seu cadastro. \n\nAcesse o app com seu CPF/CNPJ e essa senha: ${code}`,
        user.id,
      );

      return user;
    }

    if (!createUserDto.password) {
      throw new HttpException('Digite uma senha!', 400);
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.HASH_PASSWORD),
    );

    user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        doccument: createUserDto.doccument,
        cel: createUserDto.cel,
        password: hashedPassword,
        value: 0,
      },
    });

    return user;
  }

  async changePassword(
    { new_password, old_password }: ChangePasswordDto,
    user_id: string,
  ) {
    let user = await this.prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const validPassword = await bcrypt.compare(old_password, user.password);

    if (!validPassword) {
      throw new HttpException('Senha inválida', 400);
    }

    const hashedPassword = await bcrypt.hash(
      new_password,
      Number(process.env.HASH_PASSWORD),
    );

    user = await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return user;
  }

  async createSeller(createUserDto: CreateUserDto) {
    let user = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.HASH_PASSWORD),
    );

    const role = await this.prisma.role.findFirst({
      where: { name: 'SELLER' },
    });

    user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        doccument: createUserDto.doccument,
        cel: createUserDto.cel,
        password: hashedPassword,
        code: generateRandomCode(6),
        value: 0,
        roles: {
          connectOrCreate: {
            where: {
              id: role.id,
            },
            create: {
              name: 'SELLER',
            },
          },
        },
      },
    });

    return user;
  }

  async findAll(page = 1, limit = 10) {
    const users = await this.prisma.user.findMany({
      where: {
        roles: {
          none: {
            OR: [{ name: 'SELLER' }, { name: 'DISTRIBUTOR' }],
          },
        },
      },
      include: {
        recovery_tokens: true,
        roles: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalUsers = await this.prisma.user.count();

    const response = {
      nextPage: users.length >= 10 ? page + 1 : null,
      totalPages: Math.ceil(totalUsers / limit),
      nodes: plainToInstance(User, users),
    };

    return response;
  }

  async findAllByField(field: string, value: any, page = 1, limit = 10) {
    const users = await this.prisma.user.findMany({
      where: {
        [field]: value,
        roles: {
          none: {
            OR: [{ name: 'SELLER' }, { name: 'DISTRIBUTOR' }],
          },
        },
      },
      include: {
        recovery_tokens: true,
        roles: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalUsers = await this.prisma.user.count({
      where: {
        [field]: value,
        roles: {
          none: {
            OR: [{ name: 'SELLER' }, { name: 'DISTRIBUTOR' }],
          },
        },
      },
    });

    const response = {
      nextPage: users.length >= 10 ? page + 1 : null,
      totalPages: Math.ceil(totalUsers / limit),
      nodes: plainToInstance(User, users),
      totalUsers: totalUsers,
    };

    return response;
  }

  async findAllByEmail(email: string, page = 1) {
    const limitValue = 10;

    const users = await this.prisma.user.findMany({
      where: { email: { contains: email } },
      include: {
        recovery_tokens: true,
        roles: true,
      },
      take: limitValue,
      skip: (page - 1) * limitValue,
    });

    const response = {
      nextPage: users.length > 0 ? page + 1 : null,
      nodes: users,
    };

    return response;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: {
        recovery_tokens: true,
        roles: true,
        buyed_titles: {
          include: {
            selled_title: true,
            edition: true,
            titles: true,
          },
        },
        titles: true,
        winned_editions: true,
        fisical_titles: true,
        selled_titles: {
          include: {
            buyed_titles: {
              include: {
                user: true,
                titles: true,
                edition: true,
              },
            },
            seller: true,
          },
        },
        withdraws: true,
        credit_history: true,
        value_history: true,
      },
    });

    const relatedUsers = await this.prisma.user.findMany({
      where: {
        associated_to: id,
      },
    });

    return { ...user, relatedUsers: plainToInstance(User, relatedUsers) };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const userUpdated = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        address: updateUserDto.address,
        cel: updateUserDto.cel,
        country: updateUserDto.country,
        credit: updateUserDto.credit,
        neighborhood: updateUserDto.neighborhood,
        uf: updateUserDto.uf,
        value: updateUserDto.value,
        associated_to: updateUserDto.associated_to,
        cep: updateUserDto.cep,
        city: updateUserDto.city,
        complement: updateUserDto.complement,
        residence_number: updateUserDto.residence_number,
      },
    });

    return userUpdated;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
