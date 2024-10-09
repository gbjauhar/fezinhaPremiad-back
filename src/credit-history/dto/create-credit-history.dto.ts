import { DepositType, Status } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createCreditSchema = z
  .object({
    name: z.string(),
    description: z.string().nullish().default(null),
    value: z.number(),
    status: z.nativeEnum(Status).default(Status.PENDING),
    deposit_type: z.nativeEnum(DepositType).default(DepositType.PIX),
    user_id: z.string(),
  })
  .required();

export class CreateCreditHistoryDto extends createZodDto(createCreditSchema) {}
