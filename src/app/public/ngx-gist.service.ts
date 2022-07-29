import { NgxGist } from './ngx-gist.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable()
export class NgxGistService {
  public constructor(private readonly httpClient: HttpClient) {}

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
}
