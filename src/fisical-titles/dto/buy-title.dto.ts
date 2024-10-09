import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const buytitleSchema = z.object({
  user_id: z.string(),
  titles: z.string().array(),
  code: z.string().nullish(),
  payment_form: z.string(),
});

export class BuyTitleDto extends createZodDto(buytitleSchema) {}
