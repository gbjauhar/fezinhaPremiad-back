import { Title as DBTitle } from '@prisma/client';
import { Type } from 'class-transformer';
import { BuyedTitle } from 'src/selled-titles/entities/buyed-title.entity';
import { User } from 'src/users/entities/user.entity';

export enum PaymentFormStatus {
  BALANCE = 'DONE',
  CREDIT = 'DONE',
  CREDIT_CARD = 'PENDING',
  PIX = 'PENDING',
  DEBIT = 'PENDING',
}

export class Title implements DBTitle {
  id: string;
  name: string;
  dozens: string[];
  bar_code: string;
  qr_code: string;
  chances: number;
  value: number;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  buyed_title_id: string;
  edition_id: string;

  payment_id: string;
  deleted: boolean;

  @Type(() => User)
  user: User;

  @Type(() => BuyedTitle)
  buyed_title: BuyedTitle;
}
