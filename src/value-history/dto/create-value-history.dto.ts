import { DepositType, Status } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createValueHistorySchema = z
  .object({
    name: z.string(),
    description: z.string().nullish().default(null),
    value: z.number(),
    status: z.nativeEnum(Status).default(Status.PENDING),
    deposit_type: z.nativeEnum(DepositType).default(DepositType.PIX),
    user_id: z.string(),
    reference: z.string().nullish().default(null),
  })
  .required();

export class CreateValueHistoryDto extends createZodDto(
  createValueHistorySchema,
) {}
