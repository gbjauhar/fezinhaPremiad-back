import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const findEditionClientsSchema = z.object({
  field: z.enum(['name', 'email', 'doccument', 'created_at']).nullish(), // Campo a ser filtrado
  value: z.any().nullable().nullish(),
  limit: z.number().nullish().default(10),
  offset: z.number().nullish().default(0),
  editionDate: z.date(),
  sortDate: z.date(),
});

type IFindEditionClientsParams = z.infer<typeof findEditionClientsSchema>;

export const findEditionClients = ({
  field,
  value,
  limit = 10,
  offset = 0,
  editionDate,
  sortDate,
}: IFindEditionClientsParams) => {
  if (field && !value) {
    throw new HttpException('É necessário informar um valor', 400);
  } else if (field && value) {
    return Prisma.sql`
      SELECT
        s.*
      FROM
        users s
      WHERE s.name = ${value} OR s.email = ${value} OR s.doccument = ${value} OR s.created_at = ${value} AND s.code IS NULL AND s.created_at > ${editionDate} AND s.created_at < ${sortDate}
      LIMIT ${limit}
      OFFSET ${limit * offset};
    `;
  }

  return Prisma.sql`
    SELECT
      s.*
    FROM
      users s
    WHERE s.code IS NULL AND s.created_at > ${editionDate} AND s.created_at < ${sortDate}
    LIMIT ${limit}
    OFFSET ${limit * offset};
  `;
};
