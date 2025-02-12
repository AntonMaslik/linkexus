import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: configService.getOrThrow<string>('LINK_MICROSERVICE_URL'),
      package: 'link',
      protoPath: join(__dirname, 'proto/link.proto'),
    },
  });

  await app.listen();
}
bootstrap();
