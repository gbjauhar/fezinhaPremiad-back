import { HttpException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const findBySellerSchema = z.object({
  edition: z.string(),
  field: z.enum(['name', 'code', 'doccument', 'distributor_code']).nullish(), // Campo a ser filtrado
  value: z.any().nullable().nullish(),
  limit: z.number().nullish().default(10),
  offset: z.number().nullish().default(0),
});

type IFindBySellerParams = z.infer<typeof findBySellerSchema>;

export const findBySeller = ({
  edition,
  field,
  value,
  limit = 10,
  offset = 0,
}: IFindBySellerParams) => {
  if (field !== 'distributor_code' && value) {
    return Prisma.sql`
      SELECT s.id, s.name, s.email, s.doccument, s.code, to_jsonb(u) as distributor,
          COUNT(CASE WHEN st.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas,
          COUNT(CASE WHEN st.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
      FROM selled_titles st
      JOIN users s ON st.seller_id = s.id
      left JOIN users u ON s.associated_to = u.id
      LEFT JOIN buyed_titles ON buyed_titles.id = st.buyed_titles_id
      LEFT JOIN editions on buyed_titles.edition_id = editions.id
      WHERE s.name = ${value} OR s.code = ${value} OR s.doccument = ${value} AND editions.name = ${edition}
      GROUP BY s.id, s.doccument, s.name, s.code, s.associated_to, u
      LIMIT ${limit}
      OFFSET ${limit * offset};
    `;
  } else if (field === 'distributor_code' && value) {
    return Prisma.sql`
      SELECT s.id, s.name, s.email, s.doccument, s.code, to_jsonb(u) as distributor,
          COUNT(CASE WHEN st.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas,
          COUNT(CASE WHEN st.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
      FROM selled_titles st
      JOIN users s ON st.seller_id = s.id
      left JOIN users u ON s.associated_to = u.id
      LEFT JOIN buyed_titles ON buyed_titles.id = st.buyed_titles_id
      LEFT JOIN editions on buyed_titles.edition_id = editions.id
      WHERE u.code = ${value} AND editions.name = ${edition}
      GROUP BY s.id, s.doccument, s.name, s.code, s.associated_to, u
      LIMIT ${limit}
      OFFSET ${limit * offset};
    `;
  } else if (field && !value) {
    throw new HttpException('É necessário informar um valor', 400);
  }

  return Prisma.sql`
    SELECT s.id, s.name, s.email, s.doccument, s.code, to_jsonb(u) as distributor,
        COUNT(CASE WHEN st.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas,
        COUNT(CASE WHEN st.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
    FROM selled_titles st
    JOIN users s ON st.seller_id = s.id
    left JOIN users u ON s.associated_to = u.id
    LEFT JOIN buyed_titles ON buyed_titles.id = st.buyed_titles_id
    LEFT JOIN editions on buyed_titles.edition_id = editions.id
    WHERE editions.name = ${edition}
    GROUP BY s.id, s.doccument, s.name, s.code, s.associated_to, u
    LIMIT ${limit}
    OFFSET ${limit * offset};
  `; // u is the distributor
};

export const findBySellerCount = ({
  edition,
  field,
  value,
}: IFindBySellerParams) => {
  if (field !== 'distributor_code' && value) {
    return Prisma.sql`
      SELECT COUNT(*)::integer as total
      FROM (
        SELECT s.id, s.name, s.email, s.doccument, s.code, to_jsonb(u) as distributor,
          COUNT(CASE WHEN st.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas,
          COUNT(CASE WHEN st.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
        FROM selled_titles st
        JOIN users s ON st.seller_id = s.id
        left JOIN users u ON s.associated_to = u.id
        LEFT JOIN buyed_titles ON buyed_titles.id = st.buyed_titles_id
        LEFT JOIN editions on buyed_titles.edition_id = editions.id
        WHERE s.name = ${value} OR s.code = ${value} OR s.doccument = ${value} AND editions.name = ${edition}
        GROUP BY s.id, s.doccument, s.name, s.code, s.associated_to, u
      ) as subconsulta
    `;
  } else if (field === 'distributor_code' && value) {
    return Prisma.sql`
      SELECT COUNT(*)::integer as total
      FROM (
        SELECT s.id, s.name, s.email, s.doccument, s.code, to_jsonb(u) as distributor,
          COUNT(CASE WHEN st.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas,
          COUNT(CASE WHEN st.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
        FROM selled_titles st
        JOIN users s ON st.seller_id = s.id
        left JOIN users u ON s.associated_to = u.id
        LEFT JOIN buyed_titles ON buyed_titles.id = st.buyed_titles_id
        LEFT JOIN editions on buyed_titles.edition_id = editions.id
        WHERE u.code = ${value} AND editions.name = ${edition}
        GROUP BY s.id, s.doccument, s.name, s.code, s.associated_to, u
      ) as subconsulta
    `;
  } else if (field && !value) {
    throw new HttpException('É necessário informar um valor', 400);
  }

  return Prisma.sql`
    SELECT COUNT(*)::integer as total
    FROM (
      SELECT s.id, s.name, s.email, s.doccument, s.code, to_jsonb(u) as distributor,
        COUNT(CASE WHEN st.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas,
        COUNT(CASE WHEN st.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
      FROM selled_titles st
      JOIN users s ON st.seller_id = s.id
      left JOIN users u ON s.associated_to = u.id
      LEFT JOIN buyed_titles ON buyed_titles.id = st.buyed_titles_id
      LEFT JOIN editions on buyed_titles.edition_id = editions.id
      WHERE editions.name = ${edition}
      GROUP BY s.id, s.doccument, s.name, s.code, s.associated_to, u
    ) as subconsulta
  `; // u is the distributor
};
