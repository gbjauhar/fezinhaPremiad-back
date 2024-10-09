import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DrawItemsService } from './draw-items.service';
import { CreateDrawItemDto } from './dto/create-draw-item.dto';
import { UpdateDrawItemDto } from './dto/update-draw-item.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { DrawItem } from './entities/draw-item.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageVideoSizeValidationPipe } from 'src/pipes/image-vide-size-validation';
import { ImageSizeValidationPipe } from 'src/pipes/image-size-validation';

@ApiTags('draw-items')
@Controller('draw-items')
export class DrawItemsController {
  constructor(private readonly drawItemsService: DrawItemsService) {}

  @ApiResponse({ status: 201, description: 'Created.', type: DrawItem })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createDrawItemDto: CreateDrawItemDto,
    @UploadedFile(new ImageSizeValidationPipe()) image?: Express.Multer.File,
  ) {
    return this.drawItemsService.create(createDrawItemDto, image);
  }

  @ApiResponse({
    status: 200,
    description: 'Return the list of draw items',
    type: [DrawItem],
  })
  @Get()
  findAll() {
    return this.drawItemsService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Return the list of draw items',
    type: [DrawItem],
  })
  @ApiParam({ name: 'edition_id', type: String })
  @Get('/edition/:edition_id')
  findAllByEdition(@Param('edition_id') edition_id: string) {
    return this.drawItemsService.findAllByEditionId(edition_id);
  }

  @ApiResponse({
    status: 200,
    description: 'Return the draw item with provided ID',
    type: DrawItem,
  })
  @ApiParam({ name: 'id', type: String })
  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.drawItemsService.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Return the draw item with provided ID and edit it',
    type: DrawItem,
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDrawItemDto: UpdateDrawItemDto,
  ) {
    return this.drawItemsService.update(id, updateDrawItemDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Return the draw item with provided ID',
    type: DrawItem,
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drawItemsService.remove(id);
  }
}
