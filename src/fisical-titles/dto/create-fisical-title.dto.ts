import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const titleSchema = z.object({
  name: z.string(),
  dozens: z.string().array(),
  user_id: z.string().nullish(),
  value: z.number(),
  chances: z.number().default(1),

  bar_code: z.string().nullish(),
  qr_code: z.string().nullish(),
});

export class CreateFisicalTitleDto extends createZodDto(titleSchema) {}
