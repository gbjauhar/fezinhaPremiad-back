import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditionsService } from './editions.service';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { DrawItem } from 'src/draw-items/entities/draw-item.entity';
import { UpdateManyEditionsDto } from './dto/update-many.dto';
import { ImageSizeValidationPipe } from 'src/pipes/image-size-validation';

@Controller('editions')
@ApiTags('Editions/Edições')
@ApiBearerAuth()
export class EditionsController {
  constructor(private readonly editionsService: EditionsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Body() createEditionDto: CreateEditionDto,
    @UploadedFile(new ImageSizeValidationPipe()) file?: Express.Multer.File,
  ) {
    return this.editionsService.create(
      {
        ...createEditionDto,
        value: Number(createEditionDto.value),
      },
      file,
    );
  }

  @Get()
  findAll() {
    return this.editionsService.findAll();
  }

  @Get('/draw-items')
  findAllDrawItems() {
    return plainToInstance(DrawItem, this.editionsService.findAllDrawItems());
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.editionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateEditionDto: UpdateEditionDto,
    @UploadedFile(new ImageSizeValidationPipe()) file?: Express.Multer.File,
  ) {
    return this.editionsService.update(id, updateEditionDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/many')
  updateMany(@Body() updateEditionDto: UpdateManyEditionsDto) {
    return this.editionsService.updateMany(updateEditionDto.editions);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.editionsService.remove(id);
  }
}
