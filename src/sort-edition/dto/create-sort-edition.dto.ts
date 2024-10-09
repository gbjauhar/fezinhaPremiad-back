import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const addSortNumberEditionSchema = z.object({
  dozens: z.string().array().describe("['01', '02', '03']"),
  editionId: z.string().uuid().describe('The id of the edition'),
  drawItemId: z.string().uuid().describe('The id of the draw item'),
});

export class AddSortNumberEditionDto extends createZodDto(
  addSortNumberEditionSchema,
) {}

const removeNumberEditionSchema = z.object({
  editionId: z.string().uuid().describe('The id of the edition'),
  drawItemId: z.string().uuid().describe('The id of the draw item'),
});

export class RemoveSortNumberEditionDto extends createZodDto(
  removeNumberEditionSchema,
) {}
