import { PartialType } from '@nestjs/swagger';
import { CreateDrawItemDto } from './create-draw-item.dto';

export class UpdateDrawItemDto extends PartialType(CreateDrawItemDto) {}
