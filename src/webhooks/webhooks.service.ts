import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, planType, provider }: any) {
    return {
      message: 'Plan created successfully',
      status: 200,
    };
  }

  async remove({ email, planType, provider }: any) {
    return {
      message: 'Plan deleted successfully',
      status: 200,
    };
  }
}
