import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreditHistoryService } from './credit-history.service';
import { CreateCreditHistoryDto } from './dto/create-credit-history.dto';
import { UpdateCreditHistoryDto } from './dto/update-credit-history.dto';
import { RequestNest } from 'src/@types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('credit-history')
@ApiTags('Credit History')
@ApiBearerAuth()
export class CreditHistoryController {
  constructor(private readonly creditHistoryService: CreditHistoryService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createCreditHistoryDto: CreateCreditHistoryDto) {
    return this.creditHistoryService.create(createCreditHistoryDto);
  }

  @Roles(Role.ADMIN)
  @Get('/all/:id')
  findAll(@Param('id') id: string) {
    return this.creditHistoryService.findAll(id);
  }

  @Roles(Role.SELLER, Role.ADMIN, Role.DISTRIBUTOR)
  @Get('/all')
  findMyHistory(@Req() req: RequestNest, @Query('date') date?: string) {
    return this.creditHistoryService.findAll(req.user.id, date);
  }

  @Roles(Role.SELLER, Role.ADMIN, Role.DISTRIBUTOR)
  @Get('/history/:id')
  findOne(@Param('id') id: string, @Req() req: RequestNest) {
    return this.creditHistoryService.findOne(id, req.user.id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditHistoryDto: UpdateCreditHistoryDto,
  ) {
    return this.creditHistoryService.update(id, updateCreditHistoryDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditHistoryService.remove(id);
  }
}
