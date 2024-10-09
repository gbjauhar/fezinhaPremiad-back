import { Prisma } from '@prisma/client';
import { z } from 'zod';

const findByCitySchema = z.object({
  edition: z.string(),
  param: z.string().nullish(),
  limit: z.number().nullish().default(10),
  offset: z.number().nullish().default(0),
});

type FindByCityParams = z.infer<typeof findByCitySchema>;

export const findByCity = ({
  edition,
  param,
  limit = 10,
  offset = 0,
}: FindByCityParams) => {
  if (param) {
    return Prisma.sql`
      SELECT buyed_titles.address_city, 
        COUNT(CASE WHEN buyed_titles.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas, 
        COUNT(CASE WHEN buyed_titles.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
      FROM buyed_titles
      LEFT JOIN editions ON buyed_titles.edition_id = editions.id
      WHERE buyed_titles.address_city = ${param} AND editions.name = ${edition}
      GROUP BY buyed_titles.address_city
      LIMIT ${limit}
      OFFSET ${limit * offset};
    `;
  }

  return Prisma.sql`
    SELECT buyed_titles.address_city, 
      COUNT(CASE WHEN buyed_titles.status = 'DONE' THEN 1 END)::integer AS vendas_concluidas, 
      COUNT(CASE WHEN buyed_titles.status = 'PENDING' THEN 1 END)::integer AS vendas_pendentes
    FROM buyed_titles
    LEFT JOIN editions ON buyed_titles.edition_id = editions.id
    WHERE editions.name = ${edition}
    GROUP BY buyed_titles.address_city
    LIMIT ${limit}
    OFFSET ${limit * offset};
  `;
};

export const findByCityCount = (param: string, edition: string) => {
  if (param) {
    return Prisma.sql`
    SELECT COUNT(*)::integer AS total
    FROM (
      SELECT buyed_titles.address_city, 
            COUNT(CASE WHEN buyed_titles.status = 'DONE' THEN 1 END) AS vendas_concluidas, 
            COUNT(CASE WHEN buyed_titles.status = 'PENDING' THEN 1 END) AS vendas_pendentes
      FROM buyed_titles
      LEFT JOIN editions ON buyed_titles.edition_id = editions.id
      WHERE buyed_titles.address_city = ${param} AND editions.name = ${edition}
      GROUP BY buyed_titles.address_city
    ) AS subconsulta;
    `;
  }

  return Prisma.sql`
    SELECT COUNT(*)::integer AS total
    FROM (
      SELECT buyed_titles.address_city, 
            COUNT(CASE WHEN buyed_titles.status = 'DONE' THEN 1 END) AS vendas_concluidas, 
            COUNT(CASE WHEN buyed_titles.status = 'PENDING' THEN 1 END) AS vendas_pendentes
      FROM buyed_titles
      LEFT JOIN editions ON buyed_titles.edition_id = editions.id
      WHERE editions.name = ${edition}
      GROUP BY buyed_titles.address_city
    ) AS subconsulta;
  `;
};
