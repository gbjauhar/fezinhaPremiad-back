import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findSalesByEdition = z.object({
  edition: z.string(), // Número da edição
  field: z.enum(['name', 'code', 'doccument', 'created_at']).nullish(), // Campo a ser filtrado
  value: z.any().nullish(), // Valor a ser filtrado do campo field
  offset: z
    .string()
    .nullish()
    .default('0')
    .transform((arg) => Number(arg)), // Offset
});

export const findEditionSellersQuery: SchemaObject =
  zodToOpenAPI(findSalesByEdition);

export class FindEditionSellersDto extends createZodDto(findSalesByEdition) {}
