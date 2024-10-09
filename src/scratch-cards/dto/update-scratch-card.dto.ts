import { PartialType } from '@nestjs/swagger';
import { CreateScratchCardDto } from './create-scratch-card.dto';

export class UpdateScratchCardDto extends PartialType(CreateScratchCardDto) {}
