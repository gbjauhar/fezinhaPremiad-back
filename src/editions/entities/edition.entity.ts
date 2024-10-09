import { ApiProperty } from '@nestjs/swagger';
import { Edition as DBEdition, EditionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

export class Edition implements DBEdition {
  @ApiProperty({ type: String, format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  draw_date: Date;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: String, enum: EditionStatus })
  status: EditionStatus;

  @ApiProperty({ type: [String] })
  selected_dozens: string[];

  @ApiProperty()
  winner_id: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  image_key: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @Type(() => User)
  winners: User[];
}
