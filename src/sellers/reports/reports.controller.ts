import {
  Controller,
  Get,
  UseGuards,
  Param,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { SellersReportsService } from './reports.service';
import { Edition } from 'src/editions/entities/edition.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RequestNest } from 'src/@types';
import { FindUserSalesBySellerQueryDto } from '../dto/find-users-sales-by-seller.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sellers/reports')
@ApiTags('Reports - Sellers')
@ApiBearerAuth()
export class SellersReportsController {
  constructor(private readonly sellersReportsService: SellersReportsService) {}

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/commissions')
  findAllClients(
    @Query('initial_date') initial_date: Date,
    @Query('end_date') end_date: Date,
  ) {
    return this.sellersReportsService.findAllCommissions({
      end_date,
      initial_date,
    });
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/client-sells/:id')
  findAllClientSells(@Param('id') user_id: string) {
    return this.sellersReportsService.findAllSellsByClient({ user_id });
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/client-sales')
  findAllClientSalesBySeller(
    @Req() req: RequestNest,
    @Query() findUserSalesBySellerQueryDto: FindUserSalesBySellerQueryDto,
  ) {
    return this.sellersReportsService.findAllSalesGroupByClient({
      seller_id: req.user.id,
      ...findUserSalesBySellerQueryDto,
    });
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/winners')
  findAllWinners(
    @Query() findUserSalesBySellerQueryDto: FindUserSalesBySellerQueryDto,
  ) {
    return plainToInstance(
      Edition,
      this.sellersReportsService.findAllWinnedEditions(
        findUserSalesBySellerQueryDto,
      ),
    );
  }
}
