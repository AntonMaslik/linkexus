import { Observable } from 'rxjs';

export interface createShortenUrlRequest {
  url: string;
}

export interface createShortenUrlResponse {
  shorten: string;
  full: string;
}

export interface getOriginalUrlRequest {
  shorten: string;
}

export interface getOriginalUrlResponse {
  shorten: string;
  full: string;
}

export interface LinkService {
  getOriginalUrl(data: {
    shorten: string;
  }): Promise<{ shorten: string; full: string }>;
  createShortenUrl(
    data: createShortenUrlRequest,
  ): Observable<createShortenUrlResponse>;
}
