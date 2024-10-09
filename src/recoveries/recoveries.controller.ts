import { Controller, Post, Body, Patch } from '@nestjs/common';
import { RecoveriesService } from './recoveries.service';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { UpdateRecoveryDto } from './dto/update-recovery.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('recoveries')
@ApiBearerAuth()
export class RecoveriesController {
  constructor(private readonly recoveriesService: RecoveriesService) {}

  @Post()
  create(@Body() createRecoveryDto: CreateRecoveryDto) {
    return this.recoveriesService.create(createRecoveryDto);
  }

  @Patch()
  changePassword(@Body() updateRecoveryDto: UpdateRecoveryDto) {
    return this.recoveriesService.resetPassword(updateRecoveryDto);
  }
}
