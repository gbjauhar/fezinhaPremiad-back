import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const filterSelledTitlesSchema = z.object({
  userFilters: z
    .enum(['address', 'cel', 'doccument', 'email', 'name', 'phone'])
    .nullish(),
  sellFilter: z.enum(['status', 'type']).nullish(),
  value: z.string(),
});

export class FilterSelledTitleDto extends createZodDto(
  filterSelledTitlesSchema,
) {}
