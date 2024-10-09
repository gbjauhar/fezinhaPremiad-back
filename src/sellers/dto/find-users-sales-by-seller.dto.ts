import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findBySellerSchema = z.object({
  seller_id: z.string().describe('Id do vendedor'),
  startDate: z.date().nullish().describe('Data inicial que deseja filtrar'),
  endDate: z.date().nullish().describe('Data final que deseja filtrar'),
  limit: z.number().nullish().default(10).describe('Limite de registros'),
  offset: z
    .string()
    .nullish()
    .default('0') // Offset
    .transform((arg) => Number(arg))
    .describe('Offset'),
});

export class FindUserSalesBySellerDto extends createZodDto(
  findBySellerSchema,
) {}

const findBySellerQuerySchema = z.object({
  startDate: z
    .string()
    .nullish()
    .describe('Data inicial que deseja filtrar')
    .transform((arg) => arg && new Date(arg)),
  endDate: z
    .string()
    .nullish()
    .describe('Data final que deseja filtrar')
    .transform((arg) => arg && new Date(arg)),
  limit: z.number().nullish().default(10).describe('Limite de registros'),
  offset: z
    .string()
    .nullish()
    .default('0') // Offset
    .transform((arg) => Number(arg))
    .describe('Offset'),
});

export class FindUserSalesBySellerQueryDto extends createZodDto(
  findBySellerQuerySchema,
) {}
