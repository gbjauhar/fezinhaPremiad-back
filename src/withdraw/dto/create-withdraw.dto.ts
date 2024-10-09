import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createWithdrawSchema = z
  .object({
    value: z.number(),
    description: z.string().nullish(),
    pix: z.string(),
    payment_form: z.string().nullish().default("PIX"),
  })
  .required();


export class CreateWithdrawDto extends createZodDto(createWithdrawSchema) {}
