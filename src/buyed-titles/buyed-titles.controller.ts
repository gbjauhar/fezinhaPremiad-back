import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { BuyedTitlesService } from './buyed-titles.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { BuyedTitle } from './entities/buyed-title.entity';
import { RequestNest } from 'src/@types';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Buyed titles')
@Controller('buyed-titles')
export class BuyedTitlesController {
  constructor(private readonly buyedTitlesService: BuyedTitlesService) {}

  @Roles(Role.ADMIN)
  @Get('/all')
  findAll() {
    return this.buyedTitlesService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('/all/edition/:edition_id')
  findAllFromEdition(@Param('edition_id') edition_id: string) {
    return this.buyedTitlesService.findAllByEdition(edition_id);
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: BuyedTitle,
  })
  @Get('/all/my')
  findAllMy(@Req() req: RequestNest) {
    return this.buyedTitlesService.findAllMy(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyedTitlesService.findOne(+id);
  }
}
