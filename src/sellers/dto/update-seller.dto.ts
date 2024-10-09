import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const updateSellerSchema = z.object({
  associated_to: z.string().nullish(),
  credit: z.number().default(0),
  value: z.number().default(0),
});

export class UpdateSellerDto extends createZodDto(updateSellerSchema) {}
