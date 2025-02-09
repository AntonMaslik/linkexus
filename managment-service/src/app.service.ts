import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

@Injectable()
export class AppService {
  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {}

  async createShortenUrl(
    createShortenUrlRequest: createShortenUrlRequest,
  ): Promise<createShortenUrlResponse> {
    const shortCode = crypto.randomBytes(3).toString('hex');

    await this.linkModel.create({
      shorten: shortCode,
      full: createShortenUrlRequest.url,
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

    return {
      shorten: urlMapping.shorten,
      full: urlMapping.full,
    };
  }
}
