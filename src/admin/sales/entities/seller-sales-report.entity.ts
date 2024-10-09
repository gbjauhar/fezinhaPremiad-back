import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export class SellerSaleReport {
  name: string;
  doccument: string;
  code: string;
  email: string;

  @Type(() => User)
  distributor?: User;

  vendas_concluidas: number;
  vendas_pendentes: number;
}
