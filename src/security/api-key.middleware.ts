// src/common/api-key.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const VALID_API_KEY = String(process.env.API_KEY); // Substitua pela sua API Key válida ou utilize uma variável de ambiente para armazená-la

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { api_key, Api_key } = req.headers;

    if (
      req.headers['api-key'] !== VALID_API_KEY &&
      Api_key !== VALID_API_KEY &&
      api_key !== VALID_API_KEY
    ) {
      return res
        .status(401)
        .json({ error: 'Acesso não autorizado. API Key inválida.' });
    }

    next(); // Permite o acesso se a API Key for válida
  }
}
