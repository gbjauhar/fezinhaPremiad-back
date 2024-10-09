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
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RequestNest } from 'src/@types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindAllWithdrawParamsDto } from './dto/find-all-withdraw.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('withdraw')
@ApiTags('Withdraw/Saques')
@ApiBearerAuth()
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post()
  create(
    @Body() createWithdrawDto: CreateWithdrawDto,
    @Req() req: RequestNest,
  ) {
    return this.withdrawService.create(createWithdrawDto, req.user.id);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query() findAllWithdrawParamsDto: FindAllWithdrawParamsDto) {
    return this.withdrawService.findAll(findAllWithdrawParamsDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAllMyWithdraw(@Req() req: RequestNest) {
    return this.withdrawService.findAllMyWithdraws({ user_id: req.user.id });
  }

  @Roles(Role.ADMIN, Role.SELLER, Role.DISTRIBUTOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWithdrawDto: UpdateWithdrawDto,
  ) {
    return this.withdrawService.update(id, updateWithdrawDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawService.remove(id);
  }
}
