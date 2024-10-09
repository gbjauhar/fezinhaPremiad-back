import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import {
  FindAllByPayment,
  salesQueryParams,
} from './dto/find-all-by-payment.dto';
import { FindSalesByEditionDto } from './dto/find-sales-by-edition';
import { RolesGuard } from 'src/roles/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import {
  FindAllBySellerDto,
  findAllBySellerQuery,
} from './dto/find-all-by-seller.dto';
import {
  CompareSaleWithEditionsDto,
  compareSaleWithEditionsSchema,
} from './dto/compare-sale-with-editions.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  FindCommissionsBySellerDto,
  findCommissionsBySellerQuery,
} from './dto/find-commissions-by-seller.dto';
import {
  FindEditionClientsDto,
  findEditionClientsQuery,
} from './dto/find-edition-clients.dto';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaceResponse } from './entities/addresses.entity';
import {
  FindEditionSellersDto,
  findEditionSellersQuery,
} from './dto/find-edition-sellers.dto';
import { FindAllSalesDto } from 'src/selled-titles/dto/find-all-filter.dto';
import { plainToInstance } from 'class-transformer';
import { SelledTitle } from 'src/selled-titles/entities/selled-title.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(CacheInterceptor)
@Roles(Role.ADMIN)
@ApiTags('Admin - Sales')
@ApiBearerAuth()
@Controller('/admin/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('/all')
  findAllSales(@Query() findAllSalesDto: FindAllSalesDto) {
    return this.salesService.findAllSales(findAllSalesDto);
  }

  @Get('/one/:id')
  findOneSale(@Param('id') id: string) {
    return this.salesService.findOneSale(id);
  }

  @ApiQuery({
    name: 'Query Params',
    schema: salesQueryParams,
  })
  @Get('/payment_form')
  findAllByPayment(@Query() findAllByPaymentDto: FindAllByPayment) {
    return this.salesService.findAllByPaymentType(findAllByPaymentDto);
  }

  @ApiQuery({
    name: 'edition',
    description: 'Número da edição',
  })
  @ApiQuery({
    name: 'field',
    description: 'Campo a ser filtrado, deve ser address_city ou address_state',
    required: true,
  })
  @ApiQuery({
    name: 'value',
    description: 'Campo a ser filtrado',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Página que deseja filtrar, começa com 0 por padrão',
    required: false,
  })
  @ApiResponse({ type: PlaceResponse })
  @Get('/place')
  findAllByPlace(@Query() findSalesByEditionDto: FindSalesByEditionDto) {
    return this.salesService.findAllByPlace(findSalesByEditionDto);
  }

  @ApiQuery({
    name: 'edition',
    ...(findAllBySellerQuery.properties.edition as any),
  })
  @ApiQuery({
    name: 'field',
    ...(findAllBySellerQuery.properties.field as any),
    required: false,
  })
  @ApiQuery({
    name: 'value',
    ...(findAllBySellerQuery.properties.value as any),
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    ...(findAllBySellerQuery.properties.offset as any),
    required: false,
  })
  @Get('/seller')
  findAllBySeller(@Query() findAllBySellerDto: FindAllBySellerDto) {
    return this.salesService.findAllBySeller(findAllBySellerDto);
  }

  @ApiQuery({
    name: 'edition',
    ...(compareSaleWithEditionsSchema.properties.edition as any),
  })
  @ApiQuery({
    name: 'offset',
    ...(compareSaleWithEditionsSchema.properties.offset as any),
    required: false,
  })
  @Get('/compare-sales')
  compareSalesWithEdition(
    @Query() compareSaleWithEditionsDto: CompareSaleWithEditionsDto,
  ) {
    return this.salesService.compareSalesWithEditions(
      compareSaleWithEditionsDto,
    );
  }

  @ApiQuery({
    name: 'edition',
    ...(findCommissionsBySellerQuery.properties.edition as any),
  })
  @ApiQuery({
    name: 'field',
    ...(findCommissionsBySellerQuery.properties.field as any),
    required: false,
  })
  @ApiQuery({
    name: 'value',
    ...(findCommissionsBySellerQuery.properties.value as any),
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    ...(findCommissionsBySellerQuery.properties.offset as any),
    required: false,
  })
  @Get('/seller-commissions')
  commissionsBySeller(
    @Query() findCommissionsBySellerDto: FindCommissionsBySellerDto,
  ) {
    return this.salesService.findAllSellersCommissions(
      findCommissionsBySellerDto,
    );
  }

  @ApiQuery({
    name: 'edition',
    ...(findEditionClientsQuery.properties.edition as any),
  })
  @ApiQuery({
    name: 'field',
    ...(findEditionClientsQuery.properties.field as any),
    required: false,
  })
  @ApiQuery({
    name: 'value',
    ...(findEditionClientsQuery.properties.value as any),
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    ...(findEditionClientsQuery.properties.offset as any),
    required: false,
  })
  @Get('/edition-clients')
  findEditionClients(@Query() findEditionClientsDto: FindEditionClientsDto) {
    return this.salesService.findEditionClients(findEditionClientsDto);
  }

  @ApiQuery({
    name: 'edition',
    ...(findEditionSellersQuery.properties.edition as any),
  })
  @ApiQuery({
    name: 'field',
    ...(findEditionSellersQuery.properties.field as any),
    required: false,
  })
  @ApiQuery({
    name: 'value',
    ...(findEditionSellersQuery.properties.value as any),
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    ...(findEditionSellersQuery.properties.offset as any),
    required: false,
  })
  @Get('/edition-sellers')
  findEditionSellers(@Query() findEditionSellersDto: FindEditionSellersDto) {
    return this.salesService.findEditionSellers(findEditionSellersDto);
  }
}
