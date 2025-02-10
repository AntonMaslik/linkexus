import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  getOriginalUrlRequest,
  getOriginalUrlResponse,
  ShortenService,
} from './interface/shorten';
import { LinkService } from './interface/link';
import { createShortenUrlRequest } from './interface/link';
import { firstValueFrom } from 'rxjs';
import { GrpcUnknownException } from 'nestjs-grpc-exceptions';

@Injectable()
export class AppService {
  private linkService: LinkService;
  private shortenService: ShortenService;

  constructor(
    @Inject('LINK_SERVICE') private linkClient: ClientGrpc,
    @Inject('SHORTEN_SERVICE') private shortenClient: ClientGrpc,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.linkService = this.linkClient.getService<LinkService>('LinkService');
    this.shortenService =
      this.shortenClient.getService<ShortenService>('ShortenService');
  }

  async createLink(
    createShortenUrlRequest: createShortenUrlRequest,
  ): Promise<string> {
    try {
      const link = await firstValueFrom(
        this.linkService.createShortenUrl(createShortenUrlRequest),
      );

      const redirectLink = `http://${
        this.configService.getOrThrow<string>('API_GATEWAY_HOST') +
        ':' +
        this.configService.getOrThrow<string>('PORT')
      }/${link.shorten}`;

      return redirectLink;
    } catch (error) {
      return error;
    }
  }

  async getLink(
    getOriginalUrlRequest: getOriginalUrlRequest,
  ): Promise<getOriginalUrlResponse> {
    const getOriginalUrlResponse = await firstValueFrom(
      this.shortenService.getOriginalUrl(getOriginalUrlRequest),
    );

    return getOriginalUrlResponse;
  }
}
