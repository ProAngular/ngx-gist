import { NgxGist } from './ngx-gist.model';
import { Pipe, PipeTransform } from '@angular/core';
import { isNonEmptyString, isStringArray } from './ngx-gist.utilities';

@Pipe({ name: 'gistFileFilter' })
export class GistFileFilterPipe implements PipeTransform {
  public transform(
    files: NgxGist['highlightedFiles'] | null,
    displayOnlyFileNames?: string | readonly string[] | null,
  ): NgxGist['highlightedFiles'] {
    if (!files) {
      return [];
    }

    if (!displayOnlyFileNames || displayOnlyFileNames === '') {
      return files;
    }

    if (isNonEmptyString(displayOnlyFileNames)) {
      return (
        files.filter(({ filename }) => displayOnlyFileNames === filename) ?? []
      );
    }

    if (isStringArray(displayOnlyFileNames)) {
      return files.filter(({ filename }) =>
        displayOnlyFileNames.includes(filename),
      );
    }

    return files;
  }
}
