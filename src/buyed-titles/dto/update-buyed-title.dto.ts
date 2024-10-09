import { PartialType } from '@nestjs/swagger';
import { CreateBuyedTitleDto } from './create-buyed-title.dto';

export class UpdateBuyedTitleDto extends PartialType(CreateBuyedTitleDto) {}
