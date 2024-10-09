import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const addCreditSchema = z.object({
  user_id: z.string(),
  value: z.number(),
});

export class AddCreditDto extends createZodDto(addCreditSchema) {}
