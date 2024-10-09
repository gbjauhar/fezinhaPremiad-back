import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const sellerSchema = z.object({
  user_id: z.string(),
});

export class CreateSellerDto extends createZodDto(sellerSchema) {}
