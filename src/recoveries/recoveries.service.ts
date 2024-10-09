import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { UpdateRecoveryDto } from './dto/update-recovery.dto';
import { generateRandomCode } from 'src/utils/randomCode';
import { MailService } from 'src/mail/mail.service';
import CodeEmail from '../../react-email-starter/emails/code';

@Injectable()
export class RecoveriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createRecoveryDto: CreateRecoveryDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: createRecoveryDto.email },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const code = generateRandomCode(6);

    const token = await this.prisma.recoveryTokens.create({
      data: {
        code,
        user_id: user.id,
      },
    });

    await this.mailService.addToQueue({
      component: CodeEmail({
        code,
      }),
      to: user.email,
      subject: 'Recuperação de senha',
    });

    return token;
  }

  async resetPassword(updateRecoveryDto: UpdateRecoveryDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: updateRecoveryDto.email },
    });

    if (!user) {
      throw new HttpException('Usuário não existe', 400);
    }

    const token = await this.prisma.recoveryTokens.findFirst({
      where: { code: updateRecoveryDto.code },
      include: {
        user: true,
      },
    });

    if (!token) {
      throw new HttpException('Código não existe', 400);
    }

    const hashedPassword = await bcrypt.hash(
      updateRecoveryDto.password,
      Number(process.env.HASH_PASSWORD),
    );

    await this.prisma.user.update({
      where: {
        id: token.user_id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Password changed',
      status: 200,
    };
  }
}
