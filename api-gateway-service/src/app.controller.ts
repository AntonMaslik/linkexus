import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { createShortenUrlRequest } from './interface/link';
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(GrpcToHttpInterceptor)
  async createLink(
    @Body() createShortenUrlRequest: createShortenUrlRequest,
  ): Promise<string> {
    try {
      return this.appService.createLink(createShortenUrlRequest);
    } catch (error) {
      return error;
    }
  }

  @Get(':shortId')
  @UseInterceptors(GrpcToHttpInterceptor)
  async redirect(
    @Param('shortId') shortId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const getOriginalUrlResponse = await this.appService.getLink({
        shorten: shortId,
      });

      return res.redirect(getOriginalUrlResponse.full);
    } catch (error) {
      return error;
    }
  }
}
