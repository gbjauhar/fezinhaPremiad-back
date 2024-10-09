import { OnQueueError, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';

export type IAddMailDto = CreateMailDto;

@Processor('mailQueue')
export class MailConsumer {
  constructor(private mailService: MailService) {}

  @OnQueueError()
  async onError(job: Job<IAddMailDto>, error: Error) {
    console.log(`Erro ao processar job de e-mail: ${error.message}`);
  }

  @Process('sendMail')
  async addMail(job: Job<IAddMailDto>) {
    console.log(`Processando job de e-mail: ${job.id}`);
    try {
      const { data } = job;

      if (data) {
        await this.mailService.sendMail({
          to: data.to,
          html: data.html,
          subject: data.subject,
        });

        console.log(`E-mail sent to: ${job.data.to}`);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
