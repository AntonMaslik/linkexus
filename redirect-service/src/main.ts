import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: configService.getOrThrow<string>('SHORTEN_MICROSERVICE_URL'),
      package: 'shorten',
      protoPath: join(__dirname, 'proto/shorten.proto'),
    },
  });

  await app.listen();
}
bootstrap();
