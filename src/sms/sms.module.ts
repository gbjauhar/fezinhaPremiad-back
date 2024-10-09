import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SNSClient } from '@aws-sdk/client-sns';
import { PrismaService } from 'src/prisma/prisma.service';
import { BullModule } from '@nestjs/bull';
import { SmsConsumer } from './sms.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'smsQueue',
    }),
  ],
  providers: [SmsService, SNSClient, PrismaService, SmsConsumer],
  exports: [SmsService, SNSClient, BullModule, SmsConsumer],
})
export class SmsModule {}
