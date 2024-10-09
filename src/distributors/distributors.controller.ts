import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { VinculateDistributorDto } from './dto/vinculate-distributor.dto';
import { RequestNest } from 'src/@types';
import { plainToClass } from 'class-transformer';
import { Distributor } from './entities/distributor.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('distributors')
@ApiTags('Distributors')
@ApiBearerAuth()
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createDistributorDto: CreateDistributorDto) {
    return plainToClass(
      Distributor,
      this.distributorsService.create(createDistributorDto),
    );
  }

  @Roles(Role.SELLER, Role.DISTRIBUTOR, Role.ADMIN)
  @Post('/vinculate')
  vinculate(
    @Body() vinculateDistributorDto: VinculateDistributorDto,
    @Req() req: RequestNest,
  ) {
    return plainToClass(
      Distributor,
      this.distributorsService.vinculate(vinculateDistributorDto, req.user.id),
    );
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.distributorsService.findAll(
      undefined,
      Number(page),
      Number(limit),
    );
  }

  @Roles(Role.ADMIN)
  @Get(':document')
  findAllByDocument(
    @Param('document') document: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.distributorsService.findAll(
      document,
      Number(page),
      Number(limit),
    );
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.distributorsService.remove(id);
  }
}
