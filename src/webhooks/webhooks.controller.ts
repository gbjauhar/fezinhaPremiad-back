import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('webhooks')
@ApiTags('Webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  // @Post('/kiwify/gold')
  // createKiwifyGold(@Body() createWebhookDto: KiwifyWebhook) {
  //   const data = {
  //     email: createWebhookDto.Customer.email,
  //     planType: PlanType.GOLD,
  //     provider: 'Kiwify',
  //   };

  //   return this.webhooksService.create(data);
  // }

  // @Post('/kiwify/silver')
  // createKiwifySilver(@Body() createWebhookDto: KiwifyWebhook) {
  //   const data = {
  //     email: createWebhookDto.Customer.email,
  //     planType: PlanType.SILVER,
  //     provider: 'Kiwify',
  //   };

  //   return this.webhooksService.create(data);
  // }

  @Post('/kiwify')
  createKiwifyBronze(@Body() createWebhookDto: KiwifyWebhook) {
    const data = {
      email: createWebhookDto.Customer.email,
      provider: 'Kiwify',
    };

    return this.webhooksService.create(data);
  }

  @Post('/kiwify/remove')
  removeKiwify(@Body() removeDto: KiwifyWebhook) {
    const data = {
      email: removeDto.Customer.email,
      provider: 'Kiwify',
    };

    return this.webhooksService.remove(data);
  }

  // EVERMART

  // @Post('/evermart/gold')
  // createEvermartGold(@Body() createWebhookDto: EvermartWebhook) {
  //   const data = {
  //     email: createWebhookDto.email,
  //     planType: PlanType.GOLD,
  //     provider: 'Evermart',
  //   };

  //   return this.webhooksService.create(data);
  // }

  // @Post('/evermart/silver')
  // createEvermartSilver(@Body() createWebhookDto: EvermartWebhook) {
  //   const data = {
  //     email: createWebhookDto.email,
  //     planType: PlanType.SILVER,
  //     provider: 'Evermart',
  //   };

  //   return this.webhooksService.create(data);
  // }

  @Post('/evermart')
  createEvermartBronze(@Body() createWebhookDto: EvermartWebhook) {
    const data = {
      email: createWebhookDto.email,
      provider: 'Evermart',
    };

    return this.webhooksService.create(data);
  }

  @Post('/evermart/remove')
  removeEvermart(@Body() removeDto: EvermartWebhook) {
    const data = {
      email: removeDto.email,
      provider: 'Evermart',
    };

    return this.webhooksService.remove(data);
  }

  // BRAIP

  // @Post('/braip/gold')
  // createBraipGold(@Body() createWebhookDto: BraipWebhook) {
  //   const data = {
  //     email: createWebhookDto.client_email,
  //     planType: PlanType.GOLD,
  //     provider: 'Braip',
  //   };

  //   return this.webhooksService.create(data);
  // }

  // @Post('/braip/silver')
  // createBraipSilver(@Body() createWebhookDto: BraipWebhook) {
  //   const data = {
  //     email: createWebhookDto.client_email,
  //     planType: PlanType.SILVER,
  //     provider: 'Braip',
  //   };

  //   return this.webhooksService.create(data);
  // }

  @Post('/braip')
  createBraipBronze(@Body() createWebhookDto: BraipWebhook) {
    const data = {
      email: createWebhookDto.client_email,
      provider: 'Braip',
    };

    return this.webhooksService.create(data);
  }

  @Post('/braip/remove')
  removeBraip(@Body() removeDto: BraipWebhook) {
    const data = {
      email: removeDto.client_email,
      provider: 'Braip',
    };

    return this.webhooksService.remove(data);
  }

  // PERFECT PAY

  // @Post('/perfect/gold')
  // createPerfectGold(@Body() createWebhookDto: PerfectPayWebhook) {
  //   const data = {
  //     email: createWebhookDto.customer.email,
  //     planType: PlanType.GOLD,
  //     provider: 'Perfect Pay',
  //   };

  //   return this.webhooksService.create(data);
  // }

  // @Post('/perfect/silver')
  // createPerfectSilver(@Body() createWebhookDto: PerfectPayWebhook) {
  //   const data = {
  //     email: createWebhookDto.customer.email,
  //     planType: PlanType.SILVER,
  //     provider: 'Perfect Pay',
  //   };

  //   return this.webhooksService.create(data);
  // }

  @Post('/perfect')
  createPerfectBronze(@Body() createWebhookDto: PerfectPayWebhook) {
    const data = {
      email: createWebhookDto.customer.email,
      provider: 'Perfect Pay',
    };

    return this.webhooksService.create(data);
  }

  @Post('/perfect/remove')
  removePerfect(@Body() removeDto: PerfectPayWebhook) {
    const data = {
      email: removeDto.customer.email,
      provider: 'Perfect Pay',
    };

    return this.webhooksService.remove(data);
  }
}
