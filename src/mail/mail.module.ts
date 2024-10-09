import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailConsumer } from './mail.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailQueue',
    }),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService, MailConsumer, BullModule],
})
export class MailModule {}
