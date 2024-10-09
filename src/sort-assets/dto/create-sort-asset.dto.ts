import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createSortAssetSchema = z
  .object({
    name: z.string(),
  })
  .required();

export class CreateSortAssetDto extends createZodDto(createSortAssetSchema) {}
