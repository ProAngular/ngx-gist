import { gistCodec, NgxGist } from './ngx-gist.model';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import {
  decodeValueElseNull,
  isNonEmptyString,
  parsedJsonFromStringCodec,
} from './ngx-gist.utilities';
import * as io from 'io-ts';

@Injectable()
export class NgxGistService {
  private readonly httpClient = inject(HttpClient);

  private readonly delimiter = '||';

  /**
   * Fetch gist data from GitHub.
   *
   * @param gistId GitHub gist id
   * @returns Full gist model on success, undefined on error, null on deserialize failure.
   */
  public get(gistId: string): Observable<NgxGist | null | undefined> {
    return this.httpClient
      .get<NgxGist | string | null | undefined>(
        `https://api.github.com/gists/${gistId}`,
      )
      .pipe(
        catchError((error: unknown) => {
          console.error(error);
          return of(undefined);
        }),
        map((response) => NgxGist.deserialize(response) ?? null),
      );
  }

  public getFromCache(gistId: string): NgxGist | null {
    const key = `gist${this.delimiter + gistId}`;
    const value = localStorage.getItem(key);
    if (value === null || !isNonEmptyString(value)) {
      // Doesn't exist in memory
      return null;
    }

    const storedGist = decodeValueElseNull(storedGistFromJsonStringCodec)(
      value,
    );
    if (!storedGist) {
      // Failed to deserialize stored data (corruption?). Remote it and return.
      localStorage.removeItem(key);
      return null;
    }

    const now = new Date();
    if (now.getTime() > storedGist.expiration) {
      // Stored value has since expired, remove it and return.
      localStorage.removeItem(key);
      return null;
    }

    const gist = storedGist.value;
    // All is good, return unexpired gist
    return new NgxGist({
      ...gist,
      created_at: new Date(gist.created_at),
      updated_at: new Date(gist.updated_at),
    });
  }

  public setToCache(gist: NgxGist, expiresInMin?: number): void {
    const key = `gist${this.delimiter + gist.id}`;
    const now = new Date();
    const expiresInMs = expiresInMin ? expiresInMin * 60000 : 0;
    const value: StoredGist = {
      expiration: now.getTime() + expiresInMs,
      value: gist,
    };
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }
}

const storedGistCodec = io.readonly(
  io.type({
    expiration: io.number,
    value: gistCodec,
  }),
  'StoredGist',
);

const storedGistFromJsonStringCodec = parsedJsonFromStringCodec.pipe(
  storedGistCodec,
  'StoredGistFromJsonString',
);

type StoredGist = io.TypeOf<typeof storedGistCodec>;
