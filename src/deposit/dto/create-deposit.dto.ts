import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositDto {
  @ApiProperty({ type: Number })
  value: number;

  @ApiProperty()
  userId: string;
}
