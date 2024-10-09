import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const distributorSchema = z.object({
  user_id: z.string(),
  code: z.string(),
});

export class CreateDistributorDto extends createZodDto(distributorSchema) {}
