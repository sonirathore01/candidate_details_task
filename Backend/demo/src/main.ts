import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './user/services/http-exception.filter';
import { env } from './utils/env/env';

async function bootstrap() {
  try {
    console.log('Starting Nest Application');
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.enableVersioning({
      type: VersioningType.HEADER,
      header: 'Version',
    });

    app.useGlobalPipes(new ValidationPipe());
    // app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen(env.app.port);

    console.log(
      `[${env.app.name}] | Application is started: http://${env.app.host}:${env.app.port}`,
    );
  } catch (error) {
    console.error(
      `[${env.app.name}] | Application is crashed: ${error.message}`,
      error.stack,
    );
  }
}

bootstrap();
