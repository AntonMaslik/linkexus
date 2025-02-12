import { Inject, Injectable } from '@nestjs/common';
import {
  getOriginalUrlRequest,
  getOriginalUrlResponse,
  LinkService,
} from './interface/link';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GrpcUnknownException } from 'nestjs-grpc-exceptions';

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
    try {
      const response = await firstValueFrom(
        this.linkService.getOriginalUrl({
          shorten: getOriginalUrlRequest.shorten,
        }),
      );

      return response;
    } catch (error) {
      throw new GrpcUnknownException(error);
    }
  }
}
