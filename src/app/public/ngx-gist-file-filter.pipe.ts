import { NgxGist } from './ngx-gist.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gistFileFilter' })
export class GistFileFilterPipe implements PipeTransform {
  public transform(
    files: NgxGist['files'] | null,
    displayOnlyFileName?: string | null,
  ): NgxGist['files'] {
    if (!files) {
      return {};
    }

    if (!displayOnlyFileName) {
      return files;
    }

    return {
      [displayOnlyFileName]: files[displayOnlyFileName],
    };
  }
}
