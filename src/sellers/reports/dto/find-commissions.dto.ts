import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findAllCommissionsSchema = z
  .object({
    initial_date: z.date().optional(),
    end_date: z.date().optional(),
  })
  .optional();

export class FindCommissionsDto extends createZodDto(
  findAllCommissionsSchema,
) {}
