import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import { getOriginalUrlRequest } from './interface/link';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ShortenService', 'getOriginalUrl')
  async getOriginalUrl(getOriginalUrlRequest: getOriginalUrlRequest) {
    const getOriginalUrlResponse = await this.appService.getOriginalUrl(
      getOriginalUrlRequest,
    );

    return getOriginalUrlResponse;
  }
}
