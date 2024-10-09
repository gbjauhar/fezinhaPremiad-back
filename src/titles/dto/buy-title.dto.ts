import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const buytitleSchema = z.object({
  user_doccument: z.string(),
  titles: z.string().array(),
  code: z.string().nullish(),
  payment_form: z.enum(['PIX', 'CREDIT_CARD', 'CREDIT', 'BALANCE', 'DEBIT']),
});

export class BuyTitleDto extends createZodDto(buytitleSchema) {}
