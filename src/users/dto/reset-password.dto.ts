import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const changePasswordSchema = z.object({
  old_password: z.string(),
  new_password: z.string(),
});

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
