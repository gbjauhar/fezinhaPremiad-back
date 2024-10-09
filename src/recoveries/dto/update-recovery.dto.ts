import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const updateRecoveryDto = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
  password: z.string().min(6),
});

export class UpdateRecoveryDto extends createZodDto(updateRecoveryDto) {}
