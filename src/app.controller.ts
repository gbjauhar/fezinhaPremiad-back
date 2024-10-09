import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { NotificationsService } from './notifications/notifications.service';
import { SubscriptionNotificationDTO } from './notifications/dtos/SubscriptionNotification.dto';
import { CPFAuthGuard } from './auth/cpf-auth.guard';
import { RequestNest } from './@types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './auth/dtos/login.dto';

@Controller()
@ApiTags('Login')
export class AppController {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: RequestNest, @Body() body: LoginDto) {
    return this.authService.login(req.user);
  }

  @UseGuards(CPFAuthGuard)
  @Post('auth/doccument')
  async loginByDoccument(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('push/public-key')
  getPublicKey() {
    return this.notificationService.getPublicKey();
  }

  @Post('push/register')
  setSubscription(
    @Body('subscription') subscription: SubscriptionNotificationDTO,
  ) {
    return this.notificationService.registerWebPush(subscription);
  }

  @Get('push/send')
  sendPush() {
    return this.notificationService.sendWebPush('Oi', 'Nova mensagem');
  }
}
