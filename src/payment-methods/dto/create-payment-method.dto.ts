import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createPaymentMethodSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
});

export class CreatePaymentMethodDto extends createZodDto(
  createPaymentMethodSchema,
) {}
