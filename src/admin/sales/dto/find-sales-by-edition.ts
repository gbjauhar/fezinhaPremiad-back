import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findSalesByEdition = z.object({
  edition: z.string(), // Número da edição
  field: z.enum(['address_state', 'address_city']).nullable().nullish(), // Campo a ser filtrado
  value: z.any().nullable().nullish(), // Valor a ser filtrado do campo field
  offset: z
    .string()
    .nullish()
    .default('0')
    .transform((arg) => Number(arg)),
});

export class FindSalesByEditionDto extends createZodDto(findSalesByEdition) {}
