import { Module } from '@nestjs/common';
import { RecoveriesService } from './recoveries.service';
import { RecoveriesController } from './recoveries.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [RecoveriesController],
  providers: [RecoveriesService, PrismaService],
})
export class RecoveriesModule {}
