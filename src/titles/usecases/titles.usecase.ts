import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BuyTitleDto } from '../dto/buy-title.dto';
import { IbgeService } from 'src/ibge/ibge.service';
import { getRandomInt } from 'src/utils/getRandomInt';
import { getPercentage } from 'src/utils/percentage';
import { OptionsToPay, Status } from '@prisma/client';
import { format } from 'date-fns';
import { User } from 'src/users/entities/user.entity';
import { PaymentFormStatus } from '../entities/title.entity';
import { generateRandomReference } from 'src/utils/generateRandomReference';
import { PagstarService } from 'src/pagstar/pagstar.service';

@Injectable()
export class TitlesUseCase {
  constructor(private prisma: PrismaService, private pagstar: PagstarService) {}

  async buyTitleAsSeller(
    buyTitleDto: BuyTitleDto,
    user: User,
    ibgeService: IbgeService,
  ) {
    const titles = await this.prisma.title.findMany({
      where: { id: { in: buyTitleDto.titles } },
      include: {
        edition: true,
      },
    });

    if (!titles || titles.length <= 0) {
      throw new HttpException('Título já foi comprado ou não existe', 400);
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

    const seller = await this.prisma.user.findFirst({
      where: { code: buyTitleDto.code },
    });

    const ids = titles.map((title) => ({ id: title.id }));
    const totalValue = titles.reduce(
      (acc, newValue) => acc + newValue.value,
      0,
    );

    if (buyTitleDto.code && seller) {
      switch (buyTitleDto.payment_form) {
        case 'CREDIT':
          if (seller.credit < totalValue) {
            throw new HttpException('Crédito insuficiente', 400);
          }
          break;
        case 'BALANCE':
          if (seller.value < totalValue) {
            throw new HttpException('Saldo insuficiente', 400);
          }
      }
    }

    await this.prisma.title.updateMany({
      where: { id: { in: buyTitleDto.titles } },
      data: {
        updated_at: new Date(),
        user_id: user.id,
      },
    });

    const state = await ibgeService.getIbgeStateByUF(user.uf);

    const buyedTitles = await this.prisma.buyedTitles.create({
      data: {
        name: 'Vender Título de Capitalização',
        description: 'Vender Título de Capitalização',
        payment_form: buyTitleDto.payment_form,
        user_id: user.id,
        address_state: state?.nome || user.uf,
        status: PaymentFormStatus[buyTitleDto.payment_form],
        address_city: user.city,
        reference: generateRandomReference(),
        total: totalValue,
        edition_id: titles[0].edition_id,
        titles: {
          connect: ids,
        },
      },
    });

    for (const title of titles) {
      const values = Array.from({ length: 3 }, () =>
        getRandomInt(1, 10).toString(),
      );

      await this.prisma.scratchCard.create({
        data: {
          name: `Raspadinha da compra ${title.id}`,
          result: values,
          user_id: user.id,
          title_id: title.id,
          edition_id: title.edition_id,
        },
      });
    }

    if (buyTitleDto.code) {
      if (!seller) {
        throw new HttpException('Vendedor não existe', 400);
      }

      const comissionValue = getPercentage(totalValue, 10); // get 10% of the value

      switch (buyTitleDto.payment_form) {
        case 'CREDIT':
          await this.prisma.user.update({
            where: { id: seller.id },
            data: {
              value: seller.value + comissionValue,
              credit: seller.credit - totalValue,
              updated_at: new Date(),
            },
          });

          await this.prisma.creditHistory.create({
            data: {
              description: `Você realizou uma venda usando ${totalValue.toLocaleString(
                'pt-BR',
                { style: 'currency', currency: 'BRL' },
              )} de crédito de venda`,
              value: totalValue,
              deposit_type: buyTitleDto.payment_form,
              status: Status.DONE,
              type: 'OTHER',
              user_id: seller.id,
              date_format: format(new Date(), 'dd/MM/yyyy'),
            },
          });
          break;
        case 'BALANCE':
          await this.prisma.user.update({
            where: { id: seller.id },
            data: {
              value: seller.value - totalValue + comissionValue,
              updated_at: new Date(),
            },
          });
          break;
        default:
          await this.prisma.user.update({
            where: { id: seller.id },
            data: {
              value: seller.value + comissionValue,
              updated_at: new Date(),
            },
          });
          break;
      }

      // Adiciona 10% de comissão ao vendedor

      // Adiciona a venda ao histórico do vendedor
      await this.prisma.selledTitles.create({
        data: {
          name: 'Vender Título de Capitalização',
          description: 'Vender Título de Capitalização',
          reference: generateRandomReference(),
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
          name: 'Comissão de venda',
          value: comissionValue,
          deposit_type: buyTitleDto.payment_form,
          status: Status.DONE,
          type: 'COMMISSION',
          user_id: seller.id,
          date_format: format(new Date(), 'dd/MM/yyyy'),
        },
      });
    }

    if (seller.associated_to) {
      const distributor = await this.prisma.user.findFirst({
        where: { code: seller.associated_to },
      });

      const distributorCommission = getPercentage(totalValue, 5);

      await this.prisma.user.update({
        where: { id: distributor.id },
        data: {
          value: distributor.value + distributorCommission,
          updated_at: new Date(),
        },
      });

      await this.prisma.valueHistory.create({
        data: {
          description: `Você recebeu uma comissão de ${distributorCommission.toLocaleString(
            'pt-BR',
            { style: 'currency', currency: 'BRL' },
          )} do vendedor ${seller.name}`,
          name: 'Comissão de distribuidor',
          value: distributorCommission,
          deposit_type: buyTitleDto.payment_form,
          status: Status.DONE,
          type: 'COMMISSION',
          user_id: distributor.id,
          date_format: format(new Date(), 'dd/MM/yyyy'),
        },
      });
    }

    if (buyTitleDto.payment_form === 'PIX') {
      const pix = await this.pagstar.create({
        option: OptionsToPay.TITLES,
        userId: user.id,
        value: totalValue,
        name: `Venda de ${titles.length} títulos`,
      });

      return pix;
    }

    return titles;
  }

  async buyTitleAsClient(
    buyTitleDto: BuyTitleDto,
    user: User,
    ibgeService: IbgeService,
  ) {
    const titles = await this.prisma.title.findMany({
      where: { id: { in: buyTitleDto.titles } },
      include: {
        edition: true,
      },
    });

    if (!titles || titles.length <= 0) {
      throw new HttpException('Título já foi comprado ou não existe', 400);
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

    const ids = titles.map((title) => ({ id: title.id }));
    const totalValue = titles.reduce(
      (acc, newValue) => acc + newValue.value,
      0,
    );

    if (
      user.value < totalValue &&
      buyTitleDto.payment_form !== 'PIX' &&
      buyTitleDto.payment_form !== 'CREDIT_CARD' &&
      buyTitleDto.payment_form !== 'DEBIT'
    ) {
      throw new HttpException('Saldo insuficiente', 400);
    }

    await this.prisma.title.updateMany({
      where: { id: { in: buyTitleDto.titles } },
      data: {
        updated_at: new Date(),
        user_id: user.id,
      },
    });

    const state = await ibgeService.getIbgeStateByUF(user.uf);

    const buyedTitles = await this.prisma.buyedTitles.create({
      data: {
        name: 'Vender Título de Capitalização',
        description: 'Vender Título de Capitalização',
        payment_form: buyTitleDto.payment_form,
        user_id: user.id,
        address_state: state?.nome || user.uf,
        address_city: user.city,
        status: PaymentFormStatus[buyTitleDto.payment_form],
        reference: generateRandomReference(),
        total: totalValue,
        edition_id: titles[0].edition_id,
        titles: {
          connect: ids,
        },
      },
    });

    for (const title of titles) {
      const values = Array.from({ length: 3 }, () =>
        getRandomInt(1, 10).toString(),
      );

      await this.prisma.scratchCard.create({
        data: {
          name: `Raspadinha da compra ${title.id}`,
          result: values,
          user_id: user.id,
          title_id: title.id,
          edition_id: title.edition_id,
        },
      });
    }

    if (buyTitleDto.payment_form === 'PIX') {
      const pix = await this.pagstar.create({
        option: OptionsToPay.TITLES,
        userId: user.id,
        value: totalValue,
        name: `Compra de ${titles.length} títulos`,
        buyed_title_id: buyedTitles.id,
      });

      return pix;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        value: user.value - totalValue,
        updated_at: new Date(),
      },
    });

    return titles;
  }
}
