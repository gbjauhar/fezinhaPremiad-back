import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { plainToClass } from 'class-transformer';
import { Seller } from './entities/seller.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { AddCreditDto } from './dto/add-credit.dto';
import { CreateWithdrawDto } from './dto/withdraw.dto';
import { ReckoningDto } from './dto/reckoning.dto';
import { UpdateAddressSellerDto } from './dto/update-address.dto';
import { RequestNest } from 'src/@types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sellers')
@ApiTags('Sellers')
@ApiBearerAuth()
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return plainToClass(Seller, this.sellersService.create(createSellerDto));
  }

  @Roles(Role.SELLER, Role.DISTRIBUTOR, Role.ADMIN)
  @Post()
  withdraw(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.sellersService.withdraw(createWithdrawDto);
  }

  @Roles(Role.ADMIN)
  @Patch('/add-credit')
  addCredit(@Body() createSellerDto: AddCreditDto) {
    return plainToClass(Seller, this.sellersService.addCredit(createSellerDto));
  }

  @Roles(Role.ADMIN)
  @Patch('/reckoning')
  reckoning(@Body() reckoningDto: ReckoningDto) {
    return plainToClass(Seller, this.sellersService.reckoning(reckoningDto));
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Patch('/reckoning/value')
  reckoningWithValue(@Req() req: RequestNest) {
    return plainToClass(
      Seller,
      this.sellersService.reckoningWithValue(req.user.id),
    );
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.sellersService.findAll(undefined, Number(page), Number(limit));
  }

  @Roles(Role.ADMIN)
  @Get('/document/:document')
  findAllByDocument(
    @Param('document') document: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.sellersService.findAll(document, Number(page), Number(limit));
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/clients')
  findAllClients(@Req() req: RequestNest) {
    return plainToInstance(
      Seller,
      this.sellersService.findAllClients(req.user.id),
    );
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get('/client/:id')
  findOneClient(@Req() req: RequestNest, @Param('id') id: string) {
    return plainToInstance(
      Seller,
      this.sellersService.findOneClient(id, req.user.id),
    );
  }

  @Roles(Role.ADMIN)
  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return plainToClass(Seller, this.sellersService.findOne(id));
  }

  @Roles(Role.ADMIN)
  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return plainToClass(
      Seller,
      this.sellersService.update(id, updateSellerDto),
    );
  }

  @Patch('/address/my')
  updateAddress(
    @Body() updateAddressSellerDto: UpdateAddressSellerDto,
    @Req() req: RequestNest,
  ) {
    return plainToClass(
      Seller,
      this.sellersService.updateAddress(updateAddressSellerDto, req.user.id),
    );
  }

  @Roles(Role.ADMIN)
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return plainToClass(Seller, this.sellersService.remove(id));
  }
}
