import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Link, LinkSchema } from './repositories/links/links.schema';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './services/kafka.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
        dbName: configService.getOrThrow<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'managment-service',
            brokers: process.env.MANAGEMENT_SERVICE_KAFKA_BROKERS
              ? process.env.MANAGEMENT_SERVICE_KAFKA_BROKERS.split(',')
              : ['localhost:9092'],
          },
          consumer: {
            groupId: 'managment-service-group',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, ClientKafka, KafkaService],
  exports: [],
})
export class AppModule {}
