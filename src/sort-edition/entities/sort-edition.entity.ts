import { ApiProperty } from '@nestjs/swagger';
import { Edition } from 'src/editions/entities/edition.entity';
import { Title } from 'src/titles/entities/title.entity';

export class SortEdition {
  @ApiProperty({ type: () => Edition })
  sortEdition: Edition;

  @ApiProperty({ type: () => [Title] })
  titlesWithTheseDozens: Title[];
}
