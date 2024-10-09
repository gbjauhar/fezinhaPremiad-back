import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import * as aws from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { RecoveriesModule } from './recoveries/recoveries.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { NotificationsService } from './notifications/notifications.service';
import { HttpModule } from '@nestjs/axios';
import { TitlesModule } from './titles/titles.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { DistributorsModule } from './distributors/distributors.module';
import { SellersModule } from './sellers/sellers.module';
import { CreditHistoryModule } from './credit-history/credit-history.module';
import { AdminModule } from './admin/admin.module';
import { ValueHistoryModule } from './value-history/value-history.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';
import { EditionsModule } from './editions/editions.module';
import { SelledTitlesModule } from './selled-titles/selled-titles.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { FisicalTitlesModule } from './fisical-titles/fisical-titles.module';
import { SortEditionModule } from './sort-edition/sort-edition.module';
import { ApiKeyMiddleware } from './security/api-key.middleware';
import { DrawItemsModule } from './draw-items/draw-items.module';
import { SortAssetsModule } from './sort-assets/sort-assets.module';
import { BuyedTitlesModule } from './buyed-titles/buyed-titles.module';
import { ScratchCardsModule } from './scratch-cards/scratch-cards.module';
import { PagstarModule } from './pagstar/pagstar.module';
import { DepositModule } from './deposit/deposit.module';

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
  credentialDefaultProvider: defaultProvider,
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UsersModule,
    RecoveriesModule,
    WebhooksModule,
    TitlesModule,
    DistributorsModule,
    SellersModule,
    CreditHistoryModule,
    AdminModule,
    ValueHistoryModule,
    WithdrawModule,
    MailModule,
    SmsModule,
    EditionsModule,
    SelledTitlesModule,
    PaymentMethodsModule,
    FisicalTitlesModule,
    CacheModule.register({
      isGlobal: true,
    }),
    SortEditionModule,
    PrometheusModule.register({
      path: '/metrics/prometheus/381ff4a7-0d4f-4cdb-bdb6-4cc4402ec08b',
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    MailerModule.forRoot({
      transport: {
        SES: { ses, aws },
      },
      defaults: {
        // configurações que podem ser padrões
        from: 'Fezinha Premiada <noreply@fezinhapremiada.com>',
      },
    }),
    DrawItemsModule,
    SortAssetsModule,
    BuyedTitlesModule,
    ScratchCardsModule,
    PagstarModule,
    DepositModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    NotificationsService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .exclude('api')
      .exclude('pagstar')
      .forRoutes('*'); // Registra o middleware globalmente para todas as rotas
  }
}
