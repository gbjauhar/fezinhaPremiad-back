import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const findWithdrawsSchema = z
  .object({
    user_id: z.string().nullish(),
  })
  .required();

export class FindWithdrawsDto extends createZodDto(findWithdrawsSchema) {}
