import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { SortEditionService } from './sort-edition.service';
import {
  AddSortNumberEditionDto,
  RemoveSortNumberEditionDto,
} from './dto/create-sort-edition.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SortEditionGateway } from './sort-edition.gateway';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { SortEdition } from './entities/sort-edition.entity';

@Controller('sort-edition')
@ApiTags('Sort Editions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class SortEditionController {
  constructor(
    private readonly sortEditionService: SortEditionService,
    private sortEditionGateway: SortEditionGateway,
  ) {}

  @ApiResponse({
    status: 200,
    description:
      'Retorna a edição atual e os titulos vendidos que contém essas dezenas sorteadas',
    type: SortEdition,
  })
  @Post()
  async addDozens(@Body() addSortNumberEditionDto: AddSortNumberEditionDto) {
    const response = await this.sortEditionService.addDozen(
      addSortNumberEditionDto,
    );

    this.sortEditionGateway.emitEvent('listenSortDozen', response);

    return response;
  }

  @ApiResponse({
    status: 200,
    description:
      'Retorna a edição atual e os titulos vendidos que contém essas dezenas sorteadas',
    type: SortEdition,
  })
  @Delete()
  async removeDozens(
    @Body() addSortNumberEditionDto: RemoveSortNumberEditionDto,
  ) {
    const response = await this.sortEditionService.removeDozen(
      addSortNumberEditionDto,
    );

    this.sortEditionGateway.emitEvent('listenSortDozen', response);

    return response;
  }
}
