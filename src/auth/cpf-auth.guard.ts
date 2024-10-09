import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CPFAuthGuard extends AuthGuard('cpf') {}
