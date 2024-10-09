import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ScratchCardsService } from './scratch-cards.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { RequestNest } from 'src/@types';
import { ScratchCard } from './entities/scratch-card.entity';

@ApiTags('Raspadinhas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('scratch-cards')
export class ScratchCardsController {
  constructor(private readonly scratchCardsService: ScratchCardsService) {}

  @Get('/my')
  @ApiResponse({
    status: 200,
    description: 'Lista de raspadinhas do usuário',
    type: ScratchCard,
  })
  findAllMyScratchCards(@Req() req: RequestNest) {
    return this.scratchCardsService.findAllMyScratchCards(req.user.id);
  }

  @Get('/my/not-used')
  @ApiResponse({
    status: 200,
    description: 'Lista de raspadinhas do usuário',
    type: ScratchCard,
  })
  findAllNotUsedScratchCards(@Req() req: RequestNest) {
    return this.scratchCardsService.findAllNotUserScratchCards(req.user.id);
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.scratchCardsService.findOne(id);
  }

  @Post('/success/:card_id')
  verifySuccess(@Param('card_id') card_id: string) {
    return this.scratchCardsService.verifySuccess(card_id);
  }

  @Post('/loose/:card_id')
  verifyLoose(@Param('card_id') card_id: string) {
    return this.scratchCardsService.verifyLoose(card_id);
  }
}
