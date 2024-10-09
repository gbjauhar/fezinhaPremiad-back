import { Prisma } from '@prisma/client';
import { z } from 'zod';

const findBySellerSchema = z.object({
  seller_id: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  limit: z.number().nullish().default(10),
  offset: z.number().nullish().default(0),
});

type IFindBySellerParams = z.infer<typeof findBySellerSchema>;

export const findUserSalesBySeller = ({
  seller_id,
  startDate,
  endDate,
  limit = 10,
  offset = 0,
}: IFindBySellerParams) => {
  return Prisma.sql`
      select
        u.id,
        u.name,
        u.email,
        u.doccument,
        u.code,
        to_jsonb(s) as seller,
        COUNT(case when st.status = 'DONE' then 1 end)::integer as done_sales,
        COUNT(case when st.status = 'PENDING' then 1 end)::integer as pending_sales,
        (
        select
          SUM(vh_inner.total)
        from
          buyed_titles vh_inner
        where
          vh_inner.user_id = u.id 
        ) as total_sale_value,
        MIN(st.created_at) as created_at
      from
        selled_titles st
      join buyed_titles bt on
        bt.id = st.buyed_titles_id
      join users u on
        u.id = bt.user_id
      join users s on
        st.seller_id = s.id
      where s.id = ${seller_id} and st.created_at >= ${startDate} and st.created_at <= ${endDate}
      group by
        u.id,
        u.doccument,
        u.name,
        u.code,
        u.associated_to,
        s
      limit ${limit}
      offset ${limit * offset};
    `;
};
