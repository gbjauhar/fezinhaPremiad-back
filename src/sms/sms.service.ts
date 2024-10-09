import { Injectable } from '@nestjs/common';
import {
  SNSClient,
  SubscribeCommand,
  SubscribeCommandInput,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatCelSns } from 'src/utils/formatCelSns';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateSmsDto } from './dto/sendSms.dto';

@Injectable()
export class SmsService {
  constructor(
    private client: SNSClient,
    private prisma: PrismaService,
    @InjectQueue('smsQueue') private smsQueue: Queue<CreateSmsDto>,
  ) {
    this.client = new SNSClient({
      apiVersion: '2010-03-31',
      region: process.env.AWS_DEFAULT_REAGION,
      credentialDefaultProvider: defaultProvider,
    });
  }

  async subscribe(cel: string, user_id: string) {
    const subscribedNumber = await this.prisma.subscribedNumber.findFirst({
      where: { cel },
    });

    if (subscribedNumber) {
      return 'Number already subscribed';
    }

    const formatedCel = formatCelSns(cel);

    const params: SubscribeCommandInput = {
      Protocol: 'sms',
      TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      Endpoint: formatedCel,
    };

    const command = new SubscribeCommand(params);

    await this.client.send(command);
    await this.prisma.subscribedNumber.create({
      data: {
        cel,
        user_id,
      },
    });

    return 'Subscribed';
  }

  async sendSMS(cel: string, message: string) {
    const formatedCel = formatCelSns(cel);

    const params: PublishCommandInput = {
      Message: message /* required */,
      PhoneNumber: formatedCel /* required */,
    };

    const command = new PublishCommand(params);

    const publishTextPromise = this.client.send(command);

    publishTextPromise
      .then(function (data) {
        console.log('MessageID is ' + data.MessageId);
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });
  }

  async addToQueue(cel: string, message: string, user_id?: string) {
    return this.smsQueue.add('sendSms', {
      cel,
      message,
      user_id,
    });
  }
}
