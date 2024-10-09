import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const compareSaleWithEditions = z.object({
  edition: z.string().describe('É o número da edição'),
  offset: z
    .number()
    .nullish()
    .default(0)
    .describe('É a página atual que será buscada, por padrão é 0'), // Offset
});

export const compareSaleWithEditionsSchema: SchemaObject = zodToOpenAPI(
  compareSaleWithEditions,
);

export class CompareSaleWithEditionsDto extends createZodDto(
  compareSaleWithEditions,
) {}
