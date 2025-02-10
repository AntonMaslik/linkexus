import { Observable } from 'rxjs';

export interface getOriginalUrlRequest {
  shorten: string;
}

export interface getOriginalUrlResponse {
  shorten: string;
  full: string;
}

export interface LinkService {
  getOriginalUrl(data: { shorten: string }): Observable<getOriginalUrlResponse>;
}
