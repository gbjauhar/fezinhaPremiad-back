import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { GetSalesCountDto } from './dtos/get-sales-count.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
@ApiTags('Admin - Reports')
@ApiBearerAuth()
@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getAllSales() {
    return this.reportsService.getAllSales();
  }

  @Roles(Role.ADMIN)
  @Get('/count')
  getAllSaleCount(@Query() getSalesCountDto: GetSalesCountDto) {
    return this.reportsService.getSalesCount(getSalesCountDto.edition);
  }
}
