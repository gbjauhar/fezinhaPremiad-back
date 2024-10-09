import { EditionStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createEditionSchema = z.object({
  name: z.string(),
  draw_date: z.string().transform((value) => new Date(value)),
  order: z.number().nullish(),
  status: z.nativeEnum(EditionStatus).default(EditionStatus.OPEN),
  value: z
    .string()
    .nullish()
    .default('5')
    .transform((value) => Number(value.replace(/\D/g, ''))),
  initial_title: z.string().nullish(),
  end_title: z.string().nullish(),
});

export class CreateEditionDto extends createZodDto(createEditionSchema) {}
