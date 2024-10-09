import { Injectable } from '@nestjs/common';
import { AddToQueueDto, CreateMailDto } from './dto/create-mail.dto';

import { InjectQueue } from '@nestjs/bull';
import { IAddMailDto } from './mail.consumer';
import { Queue } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { render } from '@react-email/render';
import WelcomeEmail from '../../react-email-starter/emails/welcome';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mailQueue') private mailQueue: Queue<any>,
    private mailerService: MailerService,
  ) {}

  async sendMail({ html, subject, to }: CreateMailDto) {
    try {
      const mail = await this.mailerService.sendMail({
        to,
        subject,
        html,
      });

      return mail;
    } catch (err) {
      console.log(err);
    }
  }

  async addToQueue({ component, subject, to }: AddToQueueDto) {
    const html = render(component);

    const mail = await this.mailQueue.add('sendMail', {
      html,
      subject,
      to,
    });

    return mail;
  }
}
