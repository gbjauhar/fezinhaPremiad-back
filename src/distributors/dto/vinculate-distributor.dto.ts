import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const vinculateDistributorSchema = z.object({
  distributor_code: z.string(),
});

export class VinculateDistributorDto extends createZodDto(
  vinculateDistributorSchema,
) {}
