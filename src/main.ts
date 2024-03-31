import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { AllExceptionFilter } from './utils/http-expection.filter';
import {  mkdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

async function bootstrap() {
  const logsPath = resolve(__dirname, '../logs');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  try {
    await stat(logsPath)
  } catch (err) {
    await mkdir(resolve(__dirname, '../logs'));
  }

  const httpAdapter = app.get(HttpAdapterHost);

  app.useLogger(app.get(LoggingService));
  app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

  const options = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
