import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { createZodDto, zodToOpenAPI } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findSalesByEdition = z.object({
  edition: z.string(), // Número da edição
  payment_form: z.string().nullable().nullish(), // Forma de pagamento
  offset: z
    .string()
    .nullish()
    .default('0') // Offset
    .transform((arg) => Number(arg)),
});

export const salesQueryParams: SchemaObject = zodToOpenAPI(findSalesByEdition);

export class FindAllByPayment extends createZodDto(findSalesByEdition) {}
