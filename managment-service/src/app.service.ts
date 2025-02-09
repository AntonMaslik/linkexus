import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Link } from './repositories/links/links.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  createShortenUrlRequest,
  createShortenUrlResponse,
  getOriginalUrlRequest,
  getOriginalUrlResponse,
} from './interface/link';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Link.name) private linkModel: Model<Link>,
    private configService: ConfigService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createShortenUrl(
    createShortenUrlRequest: createShortenUrlRequest,
  ): Promise<createShortenUrlResponse> {
    const shortCode = crypto.randomBytes(3).toString('hex');

    await this.linkModel.create({
      shorten: shortCode,
      full: createShortenUrlRequest.url,
    });

    this.kafkaClient.emit('management-service', {
      urlShort: shortCode,
      urlFull: createShortenUrlRequest.url,
    });

    return {
      shorten: shortCode,
      full: createShortenUrlRequest.url,
    };
  }

  async getOriginalUrl(
    getOriginalUrlRequest: getOriginalUrlRequest,
  ): Promise<getOriginalUrlResponse> {
    const urlMapping = await this.linkModel.findOne({
      shorten: getOriginalUrlRequest.shorten,
    });

    if (!urlMapping) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    this.kafkaClient.emit('management-service', {
      urlShort: urlMapping.shorten,
      urlFull: urlMapping.full,
    });

    return {
      shorten: urlMapping.shorten,
      full: urlMapping.full,
    };
  }
}
