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
