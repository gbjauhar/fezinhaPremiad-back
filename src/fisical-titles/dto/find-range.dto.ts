import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const buytitleSchema = z.object({
  start_code: z.string(),
  end_code: z.string(),
});

export class FindByRangeDto extends createZodDto(buytitleSchema) {}
