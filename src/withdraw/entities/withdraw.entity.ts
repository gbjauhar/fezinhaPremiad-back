import { Status, Withdraw as DBWithdraw } from '@prisma/client';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export class Withdraw implements DBWithdraw {
  id: string;
  description: string;
  payment_form: string;
  status: Status;
  created_at: Date;
  updated_at: Date;
  value: number;
  user_id: string;
  pix: string;

  @Type(() => User)
  user: User;
}
