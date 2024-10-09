import { User } from '@prisma/client';
import { Request } from 'express';

interface RequestNest extends Request {
  user: User;
}
