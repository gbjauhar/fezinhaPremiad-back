import { PartialType } from '@nestjs/mapped-types';
import { CreateFisicalTitleDto } from './create-fisical-title.dto';

export class UpdateFisicalTitleDto extends PartialType(CreateFisicalTitleDto) {}
