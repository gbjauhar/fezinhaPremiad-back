import { HttpException, Injectable } from '@nestjs/common';
import {
  CreatePagstarDto,
  CreateQrCodeDto,
  PagstarPaymentStatus,
  PagstarWebhook,
} from './dto/create-pagstar.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { PagstarCreatePixDto } from './entities/pagstar.entity';
import { OptionsToPay, Status } from '@prisma/client';
import { PagstarUseCase } from './pagstar.usecase';

@Injectable()
export class PagstarService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private pagstarUseCase: PagstarUseCase,
  ) {}

  async getToken(): Promise<string | null> {
    const token = await firstValueFrom(
      this.httpService
        .post<any>(
          `${process.env.PAGSTAR_BASE_URL}/api/v2/identity/partner/login`,
          {
            email: String(process.env.PAGSTAR_EMAIL), // change to env
            access_key: String(process.env.PAGSTAR_ACCESS_KEY), // change to env
          },
          {
            headers: {
              'Content-Type': 'application/json ',
              'User-Agent': 'Nexos (nexossd@gmail.com)',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    if (token.data.data.access_token) {
      return token.data.data.access_token;
    }

    return null;
  }

  async createPix({
    name,
    doccument,
    value,
  }: CreateQrCodeDto): Promise<PagstarCreatePixDto['data']> {
    const token = await this.getToken();

    const { data: response } = await firstValueFrom(
      this.httpService.post<PagstarCreatePixDto>(
        `${process.env.PAGSTAR_BASE_URL}/api/v2/wallet/partner/transactions/generate-anonymous-pix`,
        {
          value,
          name,
          document: doccument,
          tenant_id: String(process.env.PAGSTAR_TENANT_ID),
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
            'User-Agent': 'Nexos (nexossd@gmail.com)',
          },
        },
      ),
    );

    if (response?.data?.qr_code_url) {
      return response.data;
    }
  }

  async create({
    userId,
    option,
    name,
    description,
    value,
    buyed_title_id,
  }: CreatePagstarDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new HttpException('Usuário não existe', 400);
      }

      const pix = await this.createPix({
        name: user.name,
        doccument: user.doccument,
        value,
      });

      if (!pix) {
        throw new HttpException('Erro ao criar o pix', 400);
      }

      const payment = await this.prisma.payment.create({
        data: {
          user_id: userId,
          value,
          option,
          reference: pix.external_reference,
          user_document: user.doccument,
          qr_code: pix.qr_code_url,
          pix_key: pix.pix_key,
          buyed_title_id,
          name,
          description,
        },
      });

      return payment;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async receiveFromWebhook(webhookDto: PagstarWebhook) {
    console.log('Webhook pagstar: ', webhookDto);
    if (!webhookDto.external_reference) {
      throw new HttpException('Referência não encontrada', 400);
    }

    if (webhookDto.status !== PagstarPaymentStatus.APPROVED) {
      throw new HttpException('Pagamento não aprovado', 400);
    }

    const payment = await this.prisma.payment.findFirst({
      where: {
        reference: webhookDto.external_reference,
      },
      include: {
        user: true,
      },
    });

    if (!payment) {
      throw new HttpException('Pagamento não encontrado', 400);
    }

    if (payment.status === Status.DONE) {
      throw new HttpException('Pagamento já foi confirmado', 400);
    }

    switch (payment.option) {
      case OptionsToPay.VALUE:
        await this.pagstarUseCase.pagDeposit(payment);
        break;
      case OptionsToPay.TITLES:
        await this.pagstarUseCase.pagTitles(payment);
        break;
    }

    return payment;
  }
}
