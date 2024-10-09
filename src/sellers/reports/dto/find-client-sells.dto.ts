import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const findClientSellsSchema = z.object({
  user_id: z.string().uuid(),
});

export class FindClientSellsDto extends createZodDto(findClientSellsSchema) {}
