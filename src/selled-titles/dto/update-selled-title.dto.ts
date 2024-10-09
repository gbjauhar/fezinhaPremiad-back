import { PartialType } from '@nestjs/mapped-types';
import { CreateSelledTitleDto } from './create-selled-title.dto';

export class UpdateSelledTitleDto extends PartialType(CreateSelledTitleDto) {}
