import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NgxGist } from './ngx-gist.model';
import { NgxGistService } from './ngx-gist.service';
import { gistResponse } from './ngx-gist.testing';

const url = 'https://api.github.com/gists/abc123';
const key = 'gist||abc123';

describe('NgxGistService', () => {
  let service: NgxGistService;
  let http: HttpTestingController;
  let result: NgxGist | null | undefined;

  beforeEach(() => {
    localStorage.clear();
    result = undefined;
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgxGistService,
      ],
    });
    service = TestBed.inject(NgxGistService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  describe('get', () => {
    it('deserializes a valid response into a gist model', () => {
      service.get('abc123').subscribe((value) => (result = value));
      http.expectOne(url).flush(gistResponse());
      expect(result).toBeInstanceOf(NgxGist);
      expect(result?.id).toBe('abc123');
      expect(result?.created_at).toBeInstanceOf(Date);
    });

    it('returns null on an http error', () => {
      service.get('abc123').subscribe((value) => (result = value));
      http.expectOne(url).flush('bad', { status: 404, statusText: 'Missing' });
      expect(result).toBeNull();
    });

    it('returns null when the body is not a gist', () => {
      service.get('abc123').subscribe((value) => (result = value));
      http.expectOne(url).flush({ id: 5 });
      expect(result).toBeNull();
    });
  });

  describe('cache', () => {
    it('returns null when nothing is stored', () => {
      expect(service.getFromCache('abc123')).toBeNull();
    });

    it('round trips a gist through the cache', () => {
      const gist = NgxGist.deserialize(gistResponse());
      expect(gist).not.toBeNull();
      service.setToCache(gist as NgxGist, 10);
      const cached = service.getFromCache('abc123');
      expect(cached).toBeInstanceOf(NgxGist);
      expect(cached?.id).toBe('abc123');
      expect(cached?.highlightedFiles.length).toBe(2);
    });

    it('removes and ignores an expired entry', () => {
      localStorage.setItem(
        key,
        JSON.stringify({
          expiration: Date.now() - 1000,
          value: gistResponse(),
        }),
      );
      expect(service.getFromCache('abc123')).toBeNull();
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('removes and ignores a corrupt entry', () => {
      localStorage.setItem(key, '{not json');
      expect(service.getFromCache('abc123')).toBeNull();
      expect(localStorage.getItem(key)).toBeNull();
    });
  });
});
