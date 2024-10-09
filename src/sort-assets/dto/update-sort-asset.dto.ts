import { PartialType } from '@nestjs/swagger';
import { CreateSortAssetDto } from './create-sort-asset.dto';

export class UpdateSortAssetDto extends PartialType(CreateSortAssetDto) {}
