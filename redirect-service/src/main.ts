import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5001',
      package: 'shorten',
      protoPath: join(__dirname, 'proto/shorten.proto'),
    },
  });

  await app.listen();
}
bootstrap();
