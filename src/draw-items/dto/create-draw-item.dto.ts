import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createDrawItemSchema = z
  .object({
    edition_id: z.string().uuid(),
    name: z.string(),
    value: z.string().nullish(),
  })
  .required();

export class CreateDrawItemDto extends createZodDto(createDrawItemSchema) {}
