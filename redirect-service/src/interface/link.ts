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
}
