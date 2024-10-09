import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { CPFStrategy } from './cpf.strategy';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
    CPFStrategy,
    makeCounterProvider({
      name: 'login_counter',
      help: 'The number of logged users today',
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
