import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1/api');

  app.use(helmet());
  app.enableCors();
  app.flushLogs();

  app.enableShutdownHooks();

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 5001,
    },
  });
  await app.startAllMicroservices();

  await app.listen(5000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => console.log(err));
