import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmsModule } from 'src/sms/sms.module';
import { MailModule } from 'src/mail/mail.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [SmsModule, MailModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    makeCounterProvider({
      name: 'register_counter',
      help: 'The number of register users requests',
    }),
  ],
})
export class UsersModule {}
