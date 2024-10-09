import { BuyedTitles, Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { SelledTitle } from './selled-title.entity';
import { Edition } from 'src/editions/entities/edition.entity';

export class BuyedTitle implements BuyedTitles {
  id: string;
  name: string;
  description: string;
  payment_form: string;
  reference: string;
  status: Status;
  total: number;
  address_state: string;
  address_city: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  edition_id: string;

  @Type(() => User)
  user: User;

  @Type(() => Edition)
  edition: Edition;

  @Type(() => SelledTitle)
  selled_title: SelledTitle;
}
