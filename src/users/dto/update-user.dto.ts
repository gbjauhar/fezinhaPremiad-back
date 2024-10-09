import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const userSchema = z.object({
  name: z.string({ description: 'erro' }).nullish(),
  cel: z.string().nullish(),
  associated_to: z.string().nullish(),
  address: z.string().nullish(),
  neighborhood: z.string().nullish(),
  cep: z.string().nullish(),
  uf: z.string().nullish(),
  city: z.string().nullish(),
  country: z.string().nullish(),
  complement: z.string().nullish(),
  credit: z.number().nullish(),
  value: z.number().nullish(),
  residence_number: z.string().nullish(),
});

export class UpdateUserDto extends createZodDto(userSchema) {}
