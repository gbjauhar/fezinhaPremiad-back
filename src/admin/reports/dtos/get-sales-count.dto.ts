import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const getSalesCountSchema = z.object({
  edition: z.string(),
});

export class GetSalesCountDto extends createZodDto(getSalesCountSchema) {}
