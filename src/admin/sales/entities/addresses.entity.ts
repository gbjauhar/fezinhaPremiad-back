import { ApiProperty } from '@nestjs/swagger';
import { Edition } from 'src/editions/entities/edition.entity';

export class AdressesEntity {
  [address: string]: string;
  vendas_concluidas: string;
  vendas_pendentes: string;
}

export class AdressesEntityResponse {
  @ApiProperty({
    description:
      'Essa chave vai ser address_state ou address_city, e não apenas address',
  })
  address: string;

  @ApiProperty()
  vendas_concluidas: string;

  @ApiProperty()
  vendas_pendentes: string;
}

export class PlaceResponse {
  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  edition: Edition;

  @ApiProperty({
    type: [AdressesEntityResponse],
  })
  places: AdressesEntityResponse[];
}
