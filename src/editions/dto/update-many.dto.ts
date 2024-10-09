import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const updateManySchema = z.object({
  editions: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable().nullish(),
      draw_date: z.string().nullable().nullish(),
      order: z.number(),
    }),
  ),
});

export class UpdateManyEditionsDto extends createZodDto(updateManySchema) {}
