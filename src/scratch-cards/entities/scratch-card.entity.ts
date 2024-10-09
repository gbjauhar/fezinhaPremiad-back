import { ApiProperty } from '@nestjs/swagger';
import { ScratchCard as DBScratchCard } from '@prisma/client';
import { Type } from 'class-transformer';
import { Edition } from 'src/editions/entities/edition.entity';
import { Title } from 'src/titles/entities/title.entity';
import { User } from 'src/users/entities/user.entity';

export class ScratchCard implements DBScratchCard {
  @ApiProperty()
  edition_id: string;

  @ApiProperty()
  title_id: string;

  @ApiProperty({ type: [String] })
  result: string[];

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  winned: boolean;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: User })
  @Type(() => User)
  user?: User;

  @ApiProperty({ type: Edition })
  @Type(() => Edition)
  edition?: Edition;

  @ApiProperty({ type: Title })
  @Type(() => Title)
  title?: Title;
}
