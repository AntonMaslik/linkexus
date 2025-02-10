import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Link } from './repositories/links/links.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  createShortenUrlRequest,
  createShortenUrlResponse,
  getOriginalUrlRequest,
  getOriginalUrlResponse,
} from './interface/link';
import {
  GrpcAbortedException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
} from 'nestjs-grpc-exceptions';

@Injectable()
export class AppService {
  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {}

  async createShortenUrl(
    createShortenUrlRequest: createShortenUrlRequest,
  ): Promise<createShortenUrlResponse> {
    const shortCode = crypto.randomBytes(3).toString('hex');

    if (createShortenUrlRequest?.url === undefined) {
      throw new GrpcInvalidArgumentException(
        'Failed to create shorten url, check structure body arguments!',
      );
    }

    const result = await this.linkModel.create({
      shorten: shortCode,
      full: createShortenUrlRequest.url,
    });

    if (!result) {
      throw new GrpcAbortedException('Failed to create shorten url');
    }

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
      throw new GrpcNotFoundException('Shorten Not Found');
    }

    return {
      shorten: urlMapping.shorten,
      full: urlMapping.full,
    };
  }
}
