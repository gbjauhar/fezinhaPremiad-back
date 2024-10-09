import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateSmsDto } from './dto/sendSms.dto';
import { SmsService } from './sms.service';

@Processor('smsQueue')
export class SmsConsumer {
  constructor(private smsService: SmsService) {}

  @OnQueueError()
  async onError(job: Job<CreateSmsDto>, error: Error) {
    console.log(`Erro ao processar job de sms: ${error?.message}`);
  }

  @Process('sendSms')
  async addMail(job: Job<CreateSmsDto>) {
    console.log(`Processando job de sms: ${job?.id}`);
    const { data } = job;

    if (data) {
      if (data.user_id) {
        await this.smsService.subscribe(data.cel, data.user_id);
      }

      await this.smsService.sendSMS(data.cel, data.message);

      console.log(`SMS sent to: ${job?.data.cel}`);
      return 'SMS sent';
    }
  }
}
