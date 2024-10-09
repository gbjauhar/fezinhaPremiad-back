import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findSalesByEdition = z.object({
  edition: z.string().describe('É o número da edição'), // Número da edição
  field: z
    .enum(['name', 'email', 'doccument', 'created_at'])
    .nullish()
    .describe('É o campo que poderá ser filtrado'), // Campo a ser filtrado
  value: z.any().nullish().describe('O valor que será buscado na filtragem'), // Valor a ser filtrado do campo field
  offset: z
    .string()
    .nullish()
    .default('0')
    .transform((arg) => Number(arg))
    .describe('É a página de itens que será carregada, o padrão é 0'), // Offset
});

export const findEditionClientsQuery: SchemaObject =
  zodToOpenAPI(findSalesByEdition);

export class FindEditionClientsDto extends createZodDto(findSalesByEdition) {}
