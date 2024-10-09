import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const sellerSchema = z.object({
  address: z.string(),
  residence_number: z.string(),
  neighborhood: z.string(),
  cep: z.string(),
  uf: z.string(),
  city: z.string(),
});

export class UpdateAddressSellerDto extends createZodDto(sellerSchema) {}
