import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const updateRecoveryDto = z.object({
  email: z.string().email(),
});

export class CreateRecoveryDto extends createZodDto(updateRecoveryDto) {
  email: string;
}
