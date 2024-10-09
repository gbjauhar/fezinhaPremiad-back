import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const findCommissionBySellerSchema = z.object({
  start_date: z.date(),
  end_date: z.date(),
  field: z.enum(['name', 'code', 'doccument']).nullish(), // Campo a ser filtrado
  value: z.any().nullable().nullish(),
  limit: z.number().nullish().default(10),
  offset: z.number().nullish().default(0),
});

type IFindCommissionBySellerParams = z.infer<
  typeof findCommissionBySellerSchema
>;

export const findCommissionBySeller = ({
  start_date,
  end_date,
  field,
  value,
  limit = 10,
  offset = 0,
}: IFindCommissionBySellerParams) => {
  if (field && !value) {
    throw new HttpException('É necessário informar um valor', 400);
  } else if (field && value) {
    return Prisma.sql`
      SELECT
        s.id,
        s.name,
        s.email,
        s.doccument,
        s.code,
        COUNT(case when vh."type"  = 'COMMISSION' then 1 end)::integer as commissions,
        (
          SELECT SUM(vh_inner.value)
          FROM value_histories vh_inner
          WHERE vh_inner.user_id = s.id AND vh_inner."type" = 'COMMISSION' AND vh_inner.created_at BETWEEN ${start_date} AND ${end_date}
        ) AS commission_value
      FROM
        users s
      LEFT JOIN value_histories vh
      ON vh.user_id  = s.id
      WHERE s.name = ${value} OR s.code = ${value} OR s.doccument = ${value} AND s.code IS NOT NULL
      GROUP BY s.id, s.doccument, s.name, s.code
      LIMIT ${limit}
      OFFSET ${limit * offset};
    `;
  }

  return Prisma.sql`
    SELECT
      s.id,
      s.name,
      s.email,
      s.doccument,
      s.code,
      COUNT(case when vh."type"  = 'COMMISSION' then 1 end)::integer as commissions,
      (
        SELECT SUM(vh_inner.value)
        FROM value_histories vh_inner
        WHERE vh_inner.user_id = s.id AND vh_inner."type" = 'COMMISSION' AND vh_inner.created_at BETWEEN ${start_date} AND ${end_date}
      ) AS commission_value
    FROM
      users s
    LEFT JOIN value_histories vh
    ON vh.user_id  = s.id
    WHERE s.code IS NOT NULL
    GROUP BY s.id, s.doccument, s.name, s.code
    LIMIT ${limit}
    OFFSET ${limit * offset};
  `;
};

export const findCommissionBySellerCount = ({
  start_date,
  end_date,
  field,
  value,
}: IFindCommissionBySellerParams) => {
  if (field && !value) {
    throw new HttpException('É necessário informar um valor', 400);
  } else if (field && value) {
    return Prisma.sql`
      SELECT COUNT(*)::integer as total FROM (
        SELECT
          s.id,
          s.name,
          s.email,
          s.doccument,
          s.code,
          COUNT(case when vh."type"  = 'COMMISSION' then 1 end)::integer as commissions,
          (
            SELECT SUM(vh_inner.value)
            FROM value_histories vh_inner
            WHERE vh_inner.user_id = s.id AND vh_inner."type" = 'COMMISSION' AND vh_inner.created_at BETWEEN ${start_date} AND ${end_date}
          ) AS commission_value
        FROM
          users s
        LEFT JOIN value_histories vh
        ON vh.user_id  = s.id
        WHERE s.name = ${value} OR s.code = ${value} OR s.doccument = ${value} AND s.code IS NOT NULL
        GROUP BY s.id, s.doccument, s.name, s.code
      ) as subquery;
    `;
  }

  return Prisma.sql`
    SELECT COUNT(*)::integer as total FROM (
      SELECT
        s.id,
        s.name,
        s.email,
        s.doccument,
        s.code,
        COUNT(case when vh."type"  = 'COMMISSION' then 1 end)::integer as commissions,
        (
          SELECT SUM(vh_inner.value)
          FROM value_histories vh_inner
          WHERE vh_inner.user_id = s.id AND vh_inner."type" = 'COMMISSION' AND vh_inner.created_at BETWEEN ${start_date} AND ${end_date}
        ) AS commission_value
      FROM
        users s
      LEFT JOIN value_histories vh
      ON vh.user_id  = s.id
      WHERE s.code IS NOT NULL
      GROUP BY s.id, s.doccument, s.name, s.code
    ) as subquery;
  `;
};
