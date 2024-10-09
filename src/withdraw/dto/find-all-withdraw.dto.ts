import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findAllWithdrawSchema = z.object({
  field: z
    .enum(['seller_name', 'doccument', 'cel', 'value', 'created_at', 'status'])
    .nullish(),
  value: z.string().nullish(),
  limit: z.number().nullish(),
  page: z.number().nullish(),
});

export class FindAllWithdrawDto extends createZodDto(findAllWithdrawSchema) {}

const findAllWithdrawParamsSchema = z.object({
  field: z
    .enum(['seller_name', 'doccument', 'cel', 'value', 'created_at', 'status'])
    .nullish(),
  value: z.string().nullish(),
  limit: z
    .string()
    .nullish()
    .default('10')
    .transform((value) => Number(value)),
  page: z
    .string()
    .nullish()
    .default('1')
    .transform((value) => Number(value)),
});

export class FindAllWithdrawParamsDto extends createZodDto(
  findAllWithdrawParamsSchema,
) {}
