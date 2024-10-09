import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const findEditionSellersSchema = z.object({
  field: z.enum(['name', 'code', 'doccument', 'created_at']).nullish(), // Campo a ser filtrado
  value: z.any().nullable().nullish(),
  limit: z.number().nullish().default(10),
  offset: z.number().nullish().default(0),
  editionDate: z.date(),
  sortDate: z.date(),
});

type IFindEditionSellersParams = z.infer<typeof findEditionSellersSchema>;

export const findEditionSellers = ({
  field,
  value,
  limit = 10,
  offset = 0,
  editionDate,
  sortDate,
}: IFindEditionSellersParams) => {
  if (field && !value) {
    throw new HttpException('É necessário informar um valor', 400);
  } else if (field && value) {
    return Prisma.sql`
      SELECT
        s.*
      FROM
        users s
      WHERE s.name = ${value} OR s.code = ${value} OR s.doccument = ${value} OR s.created_at = ${value} AND s.code IS NOT NULL AND s.created_at > ${editionDate} AND s.created_at < ${sortDate}
      LIMIT ${limit}
      OFFSET ${limit * offset};
    `;
  }

  return Prisma.sql`
    SELECT
      s.*
    FROM
      users s
    WHERE s.code IS NOT NULL AND s.created_at > ${editionDate} AND s.created_at < ${sortDate}
    LIMIT ${limit}
    OFFSET ${limit * offset};
  `;
};
