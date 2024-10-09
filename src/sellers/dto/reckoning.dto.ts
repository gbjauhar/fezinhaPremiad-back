import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const reckoningDto = z.object({
  user_id: z.string(),
});

export class ReckoningDto extends createZodDto(reckoningDto) {}
