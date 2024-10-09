import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findSellerSchema = z.object({
  id: z.string(),
  code: z.string().nullish(),
});

export class FindSellerDto extends createZodDto(findSellerSchema) {}
