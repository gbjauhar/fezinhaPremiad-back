import { Module } from '@nestjs/common';
import { TitlesService } from './titles.service';
import { TitlesController } from './titles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { IbgeModule } from 'src/ibge/ibge.module';
import { TitlesUseCase } from './usecases/titles.usecase';
import { PagstarModule } from 'src/pagstar/pagstar.module';

@Module({
  imports: [IbgeModule, PagstarModule],
  controllers: [TitlesController],
  providers: [TitlesService, PrismaService, TitlesUseCase],
})
export class TitlesModule {}
