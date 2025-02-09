import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('LinkService', 'createShortenUrl')
  createShortenUrl(data: { url: string }) {
    return this.appService.createShortenUrl(data);
  }

  @GrpcMethod('LinkService', 'getOriginalUrl')
  getOriginalUrl(data: { shorten: string }) {
    return this.appService.getOriginalUrl(data);
  }
}
