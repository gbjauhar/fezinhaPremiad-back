import { ApiProperty } from '@nestjs/swagger';
import { BuyedTitles, Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { Edition } from 'src/editions/entities/edition.entity';
import { SelledTitle } from 'src/selled-titles/entities/selled-title.entity';

export class BuyedTitle implements BuyedTitles {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  payment_form: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  status: Status;

  @ApiProperty()
  total: number;

  @ApiProperty()
  address_state: string;

  @ApiProperty()
  address_city: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  edition_id: string;

  @ApiProperty({ type: Edition })
  @Type(() => Edition)
  edition: Edition;

  @ApiProperty({ type: SelledTitle })
  @Type(() => SelledTitle)
  selled_title: SelledTitle;
}
