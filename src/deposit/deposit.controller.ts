import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Deposits')
@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.depositToUser(createDepositDto);
  }

  @Get()
  findAll() {
    return this.depositService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositService.findOne(+id);
  }
}
