import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  sendMessage(eventName: string, message: { shorten: string; full: string }) {
    this.kafkaClient.emit(eventName, message);
  }
}
