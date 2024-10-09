import { Status } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createSelledTitleSchema = z.object({
  name: z.string(),
  description: z.string(),
  payment_form: z.string(),
  reference: z.string(),
  status: z.nativeEnum(Status),
});

export class CreateSelledTitleDto extends createZodDto(
  createSelledTitleSchema,
) {}
