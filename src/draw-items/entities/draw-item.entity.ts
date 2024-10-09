import { ApiProperty } from '@nestjs/swagger';
import { DrawItems } from '@prisma/client';
import { Type } from 'class-transformer';
import { Edition } from 'src/editions/entities/edition.entity';
import { User } from 'src/users/entities/user.entity';

export class DrawItem implements DrawItems {
  @ApiProperty({ type: String, format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  selected_dozens: string[];

  @ApiProperty()
  user_id: string | null;

  @ApiProperty()
  image: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  edition_id: string;

  @ApiProperty({ type: Edition })
  @Type(() => Edition)
  edition?: Edition;

  @ApiProperty({ type: User })
  @Type(() => User)
  user?: User;
}
