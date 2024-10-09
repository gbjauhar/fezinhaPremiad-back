import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class CPFStrategy extends PassportStrategy(Strategy, 'cpf') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'doccument' });
  }

  async validate(doccument: string, password: string): Promise<any> {
    const user = await this.authService.validateUserByDoccument(
      doccument,
      password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
