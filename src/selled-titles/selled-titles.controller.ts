import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { SelledTitlesService } from './selled-titles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RequestNest } from 'src/@types';
import { FilterSelledTitleDto } from './dto/filter-sells.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('selled-titles')
@ApiTags('Selled Titles')
@ApiBearerAuth()
export class SelledTitlesController {
  constructor(private readonly selledTitlesService: SelledTitlesService) {}

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get()
  findAll(@Req() req: RequestNest) {
    return this.selledTitlesService.findAllMySellers(req.user.id);
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Post('/filter')
  findAllByFilter(
    @Req() req: RequestNest,
    @Body() filterSelledTitleDto: FilterSelledTitleDto,
  ) {
    return this.selledTitlesService.findAllMySellersFilter(
      filterSelledTitleDto,
      req.user.id,
    );
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestNest) {
    return this.selledTitlesService.findOne(id, req.user.id);
  }
}
