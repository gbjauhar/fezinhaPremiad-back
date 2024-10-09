import { ApiProperty } from '@nestjs/swagger';
import { OptionsToPay } from '@prisma/client';
import { z } from 'zod';

export enum PagstarPaymentStatus {
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
}

export class PagstarWebhook {
  status: PagstarPaymentStatus;
  type: string;
  value: number;
  external_reference: string;
  transaction_id: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export const createPagstarSchema = z.object({
  userId: z.string(),
  value: z.number(),
  option: z.nativeEnum(OptionsToPay),
  name: z.string().nullish(),
  description: z.string().nullish(),
});

export class CreatePagstarDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  value: number;

  @ApiProperty({ enum: OptionsToPay })
  option: OptionsToPay;

  @ApiProperty({ nullable: true })
  name?: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
  buyed_title_id?: string;
}

export const createQrCodeSchema = z.object({
  name: z.string(),
  doccument: z.string(),
  value: z.number(),
});

export class CreateQrCodeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  doccument: string;

  @ApiProperty()
  value: number;
}
