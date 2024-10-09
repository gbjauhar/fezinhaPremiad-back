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
import { RequestNest } from 'src/@types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { ValueHistoryService } from './value-history.service';
import { CreateValueHistoryDto } from './dto/create-value-history.dto';
import { UpdateValueHistoryDto } from './dto/update-value-history.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('value-history')
@ApiTags('Value History')
@ApiBearerAuth()
export class ValueHistoryController {
  constructor(private readonly valueHistoryService: ValueHistoryService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createCreditHistoryDto: CreateValueHistoryDto) {
    return this.valueHistoryService.create(createCreditHistoryDto);
  }

  @Roles(Role.ADMIN)
  @Get('/all/:id')
  findAll(@Param('id') id: string) {
    return this.valueHistoryService.findAll(id);
  }

  @Get('/all')
  findMyHistory(@Req() req: RequestNest, @Query('date') date?: string) {
    return this.valueHistoryService.findAll(req.user.id, date);
  }

  @Roles(Role.SELLER, Role.ADMIN, Role.DISTRIBUTOR)
  @Get('/earnings')
  findMyEarnings(@Req() req: RequestNest, @Query('date') date?: string) {
    return this.valueHistoryService.findAllEarnings(req.user.id, date);
  }

  @Roles(Role.SELLER, Role.ADMIN, Role.DISTRIBUTOR)
  @Get('/history/:id')
  findOne(@Param('id') id: string, @Req() req: RequestNest) {
    return this.valueHistoryService.findOne(id, req.user.id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditHistoryDto: UpdateValueHistoryDto,
  ) {
    return this.valueHistoryService.update(id, updateCreditHistoryDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valueHistoryService.remove(id);
  }
}
