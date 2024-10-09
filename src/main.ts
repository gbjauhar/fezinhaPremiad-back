import { NestFactory } from '@nestjs/core';
import { registerEnumType } from '@nestjs/graphql';
import { RolesEnum } from '@prisma/client';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { urlencoded, json } from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));

  registerEnumType(RolesEnum, {
    name: 'RolesEnum',
  });

  patchNestJsSwagger();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Fezinha Premiada API')
    .setDescription('This is the fezinha premiada api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
