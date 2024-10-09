import { SelledTitles, Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { Seller } from 'src/sellers/entities/seller.entity';
import { BuyedTitle } from './buyed-title.entity';

export class SelledTitle implements SelledTitles {
  id: string;
  name: string;
  description: string;
  payment_form: string;
  reference: string;
  status: Status;
  seller_id: string;
  buyed_titles_id: string;
  created_at: Date;
  updated_at: Date;

  @Type(() => BuyedTitle)
  buyed_titles: BuyedTitle;

  @Type(() => Seller)
  seller: Seller;
}
