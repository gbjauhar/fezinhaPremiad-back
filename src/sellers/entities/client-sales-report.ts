import { Type } from 'class-transformer';
import { Seller } from './seller.entity';

export class ClientSalesReport {
  id: string;
  name: string;
  email: string;
  doccument: string;
  code: string;

  @Type(() => Seller)
  seller: Seller;

  done_sales: number;
  pending_sales: number;
  total_sale_value: number;

  created_at: Date | string;
  updated_at: Date | string;
}
