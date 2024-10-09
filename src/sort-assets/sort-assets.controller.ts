import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { SortAssetsService } from './sort-assets.service';
import { CreateSortAssetDto } from './dto/create-sort-asset.dto';
import { UpdateSortAssetDto } from './dto/update-sort-asset.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageVideoSizeValidationPipe } from 'src/pipes/image-vide-size-validation';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sort-assets')
export class SortAssetsController {
  constructor(private readonly sortAssetsService: SortAssetsService) {}

  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Body() createSortAssetDto: CreateSortAssetDto,
    @UploadedFile(new ImageVideoSizeValidationPipe()) file: Express.Multer.File,
  ) {
    return this.sortAssetsService.create(createSortAssetDto, file);
  }

  @Get()
  findAll() {
    return this.sortAssetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sortAssetsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSortAssetDto: UpdateSortAssetDto,
    @UploadedFile(new ImageVideoSizeValidationPipe())
    file?: Express.Multer.File,
  ) {
    return this.sortAssetsService.update(id, updateSortAssetDto, file);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sortAssetsService.remove(id);
  }
}
