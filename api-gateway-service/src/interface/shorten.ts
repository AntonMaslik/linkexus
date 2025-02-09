import { Observable } from 'rxjs';

export interface getOriginalUrlRequest {
  shorten: string;
}

export interface getOriginalUrlResponse {
  shorten: string;
  full: string;
}

export interface ShortenService {
  getOriginalUrl(
    data: getOriginalUrlRequest,
  ): Observable<getOriginalUrlResponse>;
}
