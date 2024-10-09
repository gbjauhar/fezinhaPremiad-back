import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
// import { map, catchError, lastValueFrom, Observable } from 'rxjs';
// import * as axios from 'axios';
import { SendNotificationDTO } from './dtos/notification.dto';
import * as WebPush from 'web-push';
import { SubscriptionNotificationDTO } from './dtos/SubscriptionNotification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}
  ONESIGNAL_URL = process.env.ONE_SIGNAL_URL;
  ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID;

  publicKey =
    'BNnvoD2UXogEm_1RVGUDrEm8zGVniMZyAE6lDc7EDubrdNHvUZi8OhLddscWIl7fnK1n8Qvg7zZ9pxzpqzKtM7s';
  privateKey = 'cYugQ0ewqyEsNgMoEW1pjqTEq9E6Bh3ugNK7-LXu12M';

  headers = {
    Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
  };

  async onModuleInit() {
    // WebPush.setVapidDetails(
    //   process.env.APP_URL,
    //   this.publicKey,
    //   this.privateKey,
    // );
  }

  async getPublicKey() {
    return this.publicKey;
  }

  async registerWebPush(subscriptionDto: SubscriptionNotificationDTO) {
    if (!subscriptionDto.endpoint) {
      throw new HttpException('No endpoint', 400);
    }

    const subscriptionExists =
      await this.prisma.notificationSubscriptions.findFirst({
        where: {
          AND: [
            { endpoint: subscriptionDto.endpoint },
            { auth: subscriptionDto.keys.auth },
            { p256dh: subscriptionDto.keys.p256dh },
          ],
        },
      });

    if (subscriptionExists) {
      return {
        message: 'Subscription already registered',
        status: 200,
      };
    }

    const subscription = await this.prisma.notificationSubscriptions.create({
      data: {
        endpoint: subscriptionDto.endpoint,
        auth: subscriptionDto.keys.auth,
        p256dh: subscriptionDto.keys.p256dh,
        expirationTime: String(subscriptionDto.expirationTime),
      },
    });

    return subscription;
  }

  async sendWebPush(title: string, message: string) {
    const subscriptions =
      await this.prisma.notificationSubscriptions.findMany();

    subscriptions.forEach((subscriptionDB) => {
      const subscription: SubscriptionNotificationDTO = {
        endpoint: subscriptionDB.endpoint,
        keys: {
          auth: subscriptionDB.auth,
          p256dh: subscriptionDB.p256dh,
        },
      };

      console.log(subscription);

      WebPush.sendNotification(
        subscription,
        JSON.stringify({
          title,
          body: message,
        }),
      );
    });
  }

  async sendNotification({ title, message, url }: SendNotificationDTO) {
    const data = {
      included_segments: ['Subscribed Users'],
      contents: {
        en: message,
      },
      headings: {
        en: title,
      },
      name: 'Velasco Bet Signals',
      app_id: this.ONESIGNAL_APP_ID,
      url,
    };

    // const request = this.httpService
    //   .post(`${this.ONESIGNAL_URL}/notifications`, data, {
    //     headers: this.headers,
    //   })
    //   .pipe(map((res) => res.data))
    //   .pipe(
    //     catchError(() => {
    //       throw new ForbiddenException('API not available');
    //     }),
    //   );

    // const response = await lastValueFrom(request);

    // await this.sendWebPush(message);

    return data;
  }
}
