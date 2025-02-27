import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'LINK_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.getOrThrow<string>('LINK_MICROSERVICE_URL'),
            package: 'link',
            protoPath: join(__dirname, 'proto/link.proto'),
          },
        }),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
