import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const findAllSalesSchema = z.object({
  field: z
    .enum([
      'edition_name', //
      'payment_form', //
      'reference', //
      'status', //
      'titles_quantity', //
      'created_at', //
      'updated_at', //
      'seller_email', //
      'seller_name', //
      'seller_doccument', //
      'client_email', //
      'client_name', //
      'client_doccument', //
      'address_city', //
      'address_state', //
    ])
    .optional(),
  value: z.string().optional(),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((value) => Number(value)),
  page: z
    .string()
    .optional()
    .default('1')
    .transform((value) => Number(value)),
});

export class FindAllSalesDto extends createZodDto(findAllSalesSchema) {}

export const findAllSalesServiceSchema = z.object({
  field: z
    .enum([
      'edition_name', //
      'payment_form', //
      'reference', //
      'status', //
      'titles_quantity', //
      'created_at', //
      'updated_at', //
      'seller_email', //
      'seller_name', //
      'seller_doccument', //
      'client_email', //
      'client_name', //
      'client_doccument', //
      'address_city', //
      'address_state', //
    ])
    .optional(),
  value: z.string().optional(),
  limit: z.number().optional().default(10),
  page: z.number().optional().default(1),
});

export class FindAllSalesServiceDto extends createZodDto(
  findAllSalesServiceSchema,
) {}
