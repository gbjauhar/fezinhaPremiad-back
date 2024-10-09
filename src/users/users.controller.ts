import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/enums/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { RequestNest } from 'src/@types';
import { ChangePasswordDto } from './dto/reset-password.dto';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMetric('register_counter')
    public registerCounter: Counter<string>,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.registerCounter.inc();
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: RequestNest,
  ) {
    return plainToClass(
      User,
      this.usersService.changePassword(changePasswordDto, req.user.id),
    );
  }

  @Post('/seller')
  async createSeller(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createSeller(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/all')
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.usersService.findAll(Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/all/filter')
  findAllFilter(
    @Query('field') field: string,
    @Query('value') value: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.usersService.findAllByField(
      field,
      value,
      Number(page),
      Number(limit),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return plainToClass(User, this.usersService.findOne(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return plainToClass(User, this.usersService.update(id, updateUserDto));
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateMyInfo(@Body() updateUserDto: UpdateUserDto, @Req() req: RequestNest) {
    return plainToClass(
      User,
      this.usersService.update(req.user.id, updateUserDto),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return plainToClass(User, this.usersService.remove(id));
  }
}
