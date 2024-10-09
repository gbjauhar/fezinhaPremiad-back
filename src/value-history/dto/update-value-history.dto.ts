import { DepositType, Status } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateValueHistorySchema = z.object({
  name: z.string().nullish(),
  description: z.string(),
  value: z.number(),
  status: z.nativeEnum(Status).default(Status.PENDING),
  deposit_type: z.nativeEnum(DepositType).default(DepositType.PIX),
});

export class UpdateValueHistoryDto extends createZodDto(
  updateValueHistorySchema,
) {}
