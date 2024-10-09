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
import { FisicalTitlesService } from './fisical-titles.service';
import { CreateFisicalTitleDto } from './dto/create-fisical-title.dto';
import { UpdateFisicalTitleDto } from './dto/update-fisical-title.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fisical-titles')
@ApiTags('Fisical Titles')
@ApiBearerAuth()
export class FisicalTitlesController {
  constructor(private readonly fisicalTitlesService: FisicalTitlesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createFisicalTitleDto: CreateFisicalTitleDto) {
    return this.fisicalTitlesService.create(createFisicalTitleDto);
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get()
  findAll() {
    return this.fisicalTitlesService.findAll();
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.fisicalTitlesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/code/:code')
  findByCode(@Param('code') code: string) {
    return this.fisicalTitlesService.findByCode(code);
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/many-code')
  findManyByCode(
    @Query('start_code') start_code: string,
    @Query('end_code') end_code: string,
  ) {
    return this.fisicalTitlesService.findByRange(start_code, end_code);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFisicalTitleDto: UpdateFisicalTitleDto,
  ) {
    return this.fisicalTitlesService.update(id, updateFisicalTitleDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fisicalTitlesService.remove(id);
  }
}
