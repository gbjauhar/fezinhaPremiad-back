import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createWithdrawSchema = z.object({
  value: z.number(),
  description: z.string().nullish(),
  user_id: z.string(),
  payment_form: z.string().default('PIX'),
  pix: z.string(),
});

export class CreateWithdrawDto extends createZodDto(createWithdrawSchema) {}
