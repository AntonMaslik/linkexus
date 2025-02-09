import { Inject, Injectable } from '@nestjs/common';
import {
  getOriginalUrlRequest,
  getOriginalUrlResponse,
  LinkService,
} from './interface/link';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private linkService: LinkService;

  constructor(@Inject('LINK_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.linkService = this.client.getService<LinkService>('LinkService');
  }

  async getOriginalUrl(
    getOriginalUrlRequest: getOriginalUrlRequest,
  ): Promise<getOriginalUrlResponse> {
    const response = await this.linkService.getOriginalUrl({
      shorten: getOriginalUrlRequest.shorten,
    });

    return response;
  }
}
