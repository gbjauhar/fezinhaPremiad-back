import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { TitlesService } from './titles.service';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { BuyTitleDto } from './dto/buy-title.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('titles')
@ApiTags('Titles')
@ApiBearerAuth()
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createTitleDto: CreateTitleDto) {
    return this.titlesService.create(createTitleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/many')
  createMany(@Body() createTitleDto: CreateTitleDto[]) {
    return this.titlesService.createMany(createTitleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/many/base')
  createManyBaseTitles(@Body() createTitleDto: CreateTitleDto[]) {
    return this.titlesService.createManyBaseTitles(createTitleDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página que deseja buscar, 1 por padrão',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Quantidade de registros por página, 10 por padrão',
  })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.titlesService.findAll(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get('/total/count')
  getTotalCount() {
    return this.titlesService.getTotalUnusedTitles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.titlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateTitleDto: UpdateTitleDto) {
    return this.titlesService.update(id, updateTitleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.titlesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/buy')
  buy(@Body() buyTitleDto: BuyTitleDto) {
    return this.titlesService.buyTitle(buyTitleDto);
  }
}
