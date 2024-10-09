import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const loginSchema = z.object({
  email: z.string().email().describe('E-mail do usuário cadastrado'),
  password: z.string().min(4).describe('E-mail do usuário cadastrado'),
});

export class LoginDto extends createZodDto(loginSchema) {
  email: string;
  password: string;
}
