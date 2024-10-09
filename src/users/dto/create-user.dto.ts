import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const userSchema = z.object({
  name: z.string({ description: 'erro' }),
  email: z.string(),
  doccument: z.string(),
  cel: z.string(),
  password: z.string().nullish().nullable(),
  associated_to: z.string().nullish(),
  address: z.string().nullish(),
  neighborhood: z.string().nullish(),
  cep: z.string().nullish(),
  uf: z.string().nullish(),
  city: z.string().nullish(),
  complement: z.string().nullish(),
  residence_number: z.string().nullish(),
  country: z.string().nullish(),
  invited: z.boolean().default(false),
});

export class CreateUserDto extends createZodDto(userSchema) {}
