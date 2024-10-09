import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllByPayment } from './dto/find-all-by-payment.dto';
import { FindSalesByEditionDto } from './dto/find-sales-by-edition';
import { FindAllBySellerDto } from './dto/find-all-by-seller.dto';
import { CompareSaleWithEditionsDto } from './dto/compare-sale-with-editions.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Edition } from 'src/editions/entities/edition.entity';
import { findByState, findByStateCount } from './queries/find-by-state';
import { findByCity, findByCityCount } from './queries/find-by-city';
import { findBySeller, findBySellerCount } from './queries/find-by-seller';
import { SellerSaleReport } from './entities/seller-sales-report.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { State } from './entities/state.entity';
import { PaymentForm } from './entities/payment-form.entity';
import { AdressesEntity } from './entities/addresses.entity';
import { FindCommissionsBySellerDto } from './dto/find-commissions-by-seller.dto';
import {
  findCommissionBySeller,
  findCommissionBySellerCount,
} from './queries/find-commission-by-seller';
import { CommissionSeller } from './entities/commission-seller';
import { FindEditionSellersDto } from './dto/find-edition-sellers.dto';
import { Seller } from 'src/sellers/entities/seller.entity';
import { findEditionSellers } from './queries/find-edition-sellers';
import { FindEditionClientsDto } from './dto/find-edition-clients.dto';
import { findEditionClients } from './queries/find-edition-clients';
import { FindAllSalesServiceDto } from 'src/selled-titles/dto/find-all-filter.dto';
import { SelledTitle } from 'src/selled-titles/entities/selled-title.entity';
import { sellerField } from './filterFields/sellerField';
import { clientField } from './filterFields/clientField';
import { addressField } from './filterFields/addressField';
import { editionNameField } from './filterFields/editionNameField';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAllByPaymentType({
    edition,
    payment_form,
    offset = 0,
  }: FindAllByPayment) {
    const editionExists = await this.prisma.edition.findFirst({
      where: {
        name: edition,
      },
      include: {
        winners: true,
      },
    });

    if (!editionExists) {
      throw new HttpException('Esta edição não existe', 400);
    }

    const payment_forms = payment_form
      ? await this.prisma.$queryRaw<PaymentForm[]>`
      SELECT selled_titles.payment_form, 
            COUNT(CASE WHEN selled_titles.status = 'DONE' THEN 1 END)::integer AS done_sales, 
            COUNT(CASE WHEN selled_titles.status = 'PENDING' THEN 1 END)::integer AS pending_sales
      FROM selled_titles
      LEFT JOIN buyed_titles ON selled_titles.buyed_titles_id = buyed_titles.id
      LEFT JOIN editions ON buyed_titles.edition_id = editions.id
      WHERE selled_titles.payment_form = ${payment_form} AND editions.name = ${edition}
      GROUP BY selled_titles.payment_form
      LIMIT 10
      OFFSET ${offset * 10};
    `
      : await this.prisma.$queryRaw<PaymentForm[]>`
      SELECT selled_titles.payment_form, 
            COUNT(CASE WHEN selled_titles.status = 'DONE' THEN 1 END)::integer AS done_sales, 
            COUNT(CASE WHEN selled_titles.status = 'PENDING' THEN 1 END)::integer AS pending_sales
      FROM selled_titles
      LEFT JOIN buyed_titles ON selled_titles.buyed_titles_id = buyed_titles.id
      LEFT JOIN editions ON buyed_titles.edition_id = editions.id
      WHERE editions.name = ${edition}
      GROUP BY selled_titles.payment_form
      LIMIT 10
      OFFSET ${offset * 10};
    `;

    const all_paymentForms = payment_form
      ? await this.prisma.$queryRaw<{ total: number }>`
      SELECT COUNT(*)::integer AS total
      FROM (
        SELECT selled_titles.payment_form, 
              COUNT(CASE WHEN selled_titles.status = 'DONE' THEN 1 END) AS done_sales, 

              COUNT(CASE WHEN selled_titles.status = 'PENDING' THEN 1 END) AS pending_sales

        FROM selled_titles
        LEFT JOIN buyed_titles ON selled_titles.buyed_titles_id = buyed_titles.id
        LEFT JOIN editions ON buyed_titles.edition_id = editions.id
        WHERE selled_titles.payment_form = ${payment_form} AND editions.name = ${edition}
        GROUP BY selled_titles.payment_form
      ) AS subconsulta;
    `
      : await this.prisma.$queryRaw<{ total: number }>`
      SELECT COUNT(*)::integer AS total
      FROM (
        SELECT selled_titles.payment_form , 
              COUNT(CASE WHEN selled_titles.status = 'DONE' THEN 1 END) AS done_sales, 
              COUNT(CASE WHEN selled_titles.status = 'PENDING' THEN 1 END) AS pending_sales
        FROM selled_titles
        LEFT JOIN buyed_titles ON selled_titles.buyed_titles_id = buyed_titles.id
        LEFT JOIN editions ON buyed_titles.edition_id = editions.id
        WHERE editions.name = '0001'
        GROUP BY selled_titles.payment_form
      ) AS subconsulta;
    `;

    return {
      totalPages: Math.ceil(all_paymentForms[0].total / 10),
      hasNextPage: payment_forms?.length === 10,
      edition: plainToClass(Edition, editionExists),
      payment_forms,
    };
  }

  async findAllByPlace({
    edition,
    field,
    value,
    offset = 0,
  }: FindSalesByEditionDto) {
    const editionExists = await this.prisma.edition.findFirst({
      where: {
        name: edition,
      },
      include: {
        winners: true,
      },
    });

    if (!editionExists) {
      throw new HttpException('Esta edição não existe', 400);
    }

    // const place =
    //   field === 'address_state' ? await this.getIbgeStates(value) : undefined;

    const places = await this.prisma.$queryRaw<AdressesEntity[]>(
      field === 'address_city'
        ? findByCity({ edition, param: value, offset })
        : findByState({ edition, param: value, offset }),
    );

    const totalPlaces = await this.prisma.$queryRaw<{ total: number }>(
      field === 'address_city'
        ? findByCityCount(value, edition)
        : findByStateCount(value, edition),
    );

    return {
      totalPages: Math.ceil(totalPlaces[0].total / 10),
      hasNextPage: places?.length === 10,
      edition: plainToClass(Edition, editionExists),
      places,
    };
  }

  async findAllBySeller({
    edition,
    field,
    value,
    offset = 0,
  }: FindAllBySellerDto) {
    const editionExists = await this.prisma.edition.findFirst({
      where: {
        name: edition,
      },
      include: {
        winners: true,
      },
    });

    const sellerSales = await this.prisma.$queryRaw<SellerSaleReport[]>(
      findBySeller({ edition, field, value, offset }),
    );

    const totalSales = await this.prisma.$queryRaw<{ total: number }>(
      findBySellerCount({ edition, field, value }),
    );

    return {
      totalPages: Math.ceil(totalSales[0].total / 10),
      hasNextPage: sellerSales?.length === 10,
      edition: plainToClass(Edition, editionExists),
      sellerSales: plainToInstance(SellerSaleReport, sellerSales),
    };
  }

  async getIbgeStates(state: string): Promise<State> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<State[]>(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    const stateFind = data.find((item) => item.nome === state);

    return stateFind;
  }

  async compareSalesWithEditions({ edition }: CompareSaleWithEditionsDto) {
    const editionExists = await this.prisma.edition.findFirst({
      where: { name: edition },
      include: {
        winners: true,
      },
    });

    const lastEdition = await this.prisma.edition.findFirst({
      where: {
        id: { not: editionExists.id },
        created_at: { lte: editionExists.created_at },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 1,
      include: {
        BuyedTitles: true,
      },
    });

    if (!editionExists) {
      throw new HttpException('Esta edição não existe', 400);
    }

    const pendingSales = await this.prisma.selledTitles.count({
      where: {
        buyed_titles: {
          edition: {
            name: edition,
          },
        },
        status: 'PENDING',
      },
    });

    const doneSales = await this.prisma.selledTitles.count({
      where: {
        buyed_titles: {
          edition: {
            name: edition,
          },
        },
        status: 'DONE',
      },
    });

    const situation =
      (lastEdition?.BuyedTitles.length || 0) > pendingSales + doneSales
        ? 'DOWN'
        : 'UP';

    return {
      edition: plainToClass(Edition, editionExists),
      pendingSales: pendingSales,
      doneSales: doneSales,
      situation,
    };
  }

  async findAllSellersCommissions({
    edition,
    field,
    value,
    offset = 0,
  }: FindCommissionsBySellerDto) {
    const editionExists = await this.prisma.edition.findFirst({
      where: {
        name: edition,
      },
      include: {
        winners: true,
      },
    });

    const start_date = editionExists.created_at;
    const end_date = editionExists.draw_date;

    const sellerCommissions = await this.prisma.$queryRaw<CommissionSeller[]>(
      findCommissionBySeller({ start_date, end_date, field, value, offset }),
    );

    const sellersCommissionsCount = await this.prisma.$queryRaw<{
      total: number;
    }>(findCommissionBySellerCount({ start_date, end_date, field, value }));

    return {
      totalPages: Math.ceil(sellersCommissionsCount[0].total / 10),
      hasNextPage: sellerCommissions?.length === 10,
      edition: plainToClass(Edition, editionExists),
      sellerCommissions: plainToInstance(SellerSaleReport, sellerCommissions),
    };
  }

  async findEditionSellers({
    edition,
    field,
    offset = 0,
    value,
  }: FindEditionSellersDto) {
    const editionExists = await this.prisma.edition.findFirst({
      where: {
        name: edition,
      },
      include: {
        winners: true,
      },
    });

    if (!editionExists) {
      throw new HttpException('Esta edição não existe', 400);
    }

    const sellers = await this.prisma.$queryRaw<Seller[]>(
      findEditionSellers({
        editionDate: editionExists.created_at,
        sortDate: editionExists.draw_date,
        field,
        offset,
        value,
      }),
    );

    const sellersCount = await this.prisma.$queryRaw<Seller[]>(
      findEditionSellers({
        editionDate: editionExists.created_at,
        sortDate: editionExists.draw_date,
        field,
        offset: 0,
        value,
        limit: 999999999999999,
      }),
    );

    return {
      totalPages: Math.ceil(sellersCount.length / 10),
      hasNextPage: sellers?.length === 10,
      edition: plainToClass(Edition, editionExists),
      sellers: plainToInstance(Seller, sellers),
    };
  }

  async findEditionClients({
    edition,
    field,
    offset = 0,
    value,
  }: FindEditionClientsDto) {
    const editionExists = await this.prisma.edition.findFirst({
      where: {
        name: edition,
      },
      include: {
        winners: true,
      },
    });

    if (!editionExists) {
      throw new HttpException('Esta edição não existe', 400);
    }

    const clients = await this.prisma.$queryRaw<Seller[]>(
      findEditionClients({
        editionDate: editionExists.created_at,
        sortDate: editionExists.draw_date,
        field,
        offset,
        value,
      }),
    );

    const totalClients = await this.prisma.$queryRaw<Seller[]>(
      findEditionClients({
        editionDate: editionExists.created_at,
        sortDate: editionExists.draw_date,
        field,
        offset: 0,
        value,
        limit: 999999999999999,
      }),
    );

    return {
      totalPages: Math.ceil(totalClients.length / 10),
      hasNextPage: clients?.length === 10,
      edition: plainToClass(Edition, editionExists),
      clients: plainToInstance(Seller, clients),
    };
  }

  async findAllSales({
    page = 1,
    limit = 10,
    field,
    value,
  }: FindAllSalesServiceDto) {
    const customField =
      !sellerField(field, value) &&
      !clientField(field, value) &&
      !addressField(field, value) &&
      !editionNameField(field, value)
        ? field
        : undefined;

    const selledTitles = await this.prisma.selledTitles.findMany({
      where: {
        [customField]:
          !sellerField(field, value) &&
          !clientField(field, value) &&
          !addressField(field, value) &&
          !editionNameField(field, value)
            ? value
            : undefined,
        seller: sellerField(field, value),
        buyed_titles: {
          user: clientField(field, value),
          ...addressField(field, value),
          ...editionNameField(field, value),
        },
      },
      include: {
        buyed_titles: {
          include: {
            titles: true,
            user: true,
            edition: true,
          },
        },
        seller: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalSelledTitles = await this.prisma.selledTitles.count({
      where: {
        [customField]:
          !sellerField(field, value) &&
          !clientField(field, value) &&
          !addressField(field, value) &&
          !editionNameField(field, value)
            ? value
            : undefined,
        seller: sellerField(field, value),
        buyed_titles: {
          user: clientField(field, value),
          ...addressField(field, value),
          ...editionNameField(field, value),
        },
      },
    });

    return {
      selledTitles: plainToInstance(SelledTitle, selledTitles),
      totalPages: Math.ceil(totalSelledTitles / limit),
      totalSales: totalSelledTitles,
    };
  }

  async findOneSale(id: string) {
    const selledTitle = await this.prisma.selledTitles.findFirst({
      where: {
        id,
      },
      include: {
        buyed_titles: {
          include: {
            titles: true,
            user: true,
            edition: true,
          },
        },
        seller: true,
      },
    });

    if (!selledTitle) {
      throw new HttpException('Esta venda não existe', 400);
    }

    return selledTitle;
  }
}
