import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { createShortenUrlRequest } from './interface/link';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createLink(
    @Body() createShortenUrlRequest: createShortenUrlRequest,
  ): Promise<string> {
    return this.appService.createLink(createShortenUrlRequest);
  }

  @Get(':shortId')
  async redirect(
    @Param('shortId') shortId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const getOriginalUrlResponse = await this.appService.getLink({
      shorten: shortId,
    });

    return res.redirect(getOriginalUrlResponse.full);
  }
}
