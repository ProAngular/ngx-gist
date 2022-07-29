import { NgxGist } from './ngx-gist.model';
import { Pipe, PipeTransform } from '@angular/core';
import { isStringArray } from './ngx-gist.utilities';
import { isNonEmptyString } from 'dist/npm';

@Pipe({ name: 'gistFileFilter' })
export class GistFileFilterPipe implements PipeTransform {
  public transform(
    files: NgxGist['highlightedFiles'] | null,
    displayOnlyFileNames?: string | readonly string[] | null,
  ): NgxGist['highlightedFiles'] {
    if (!files) {
      return [];
    }

    console.log(displayOnlyFileNames);

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
