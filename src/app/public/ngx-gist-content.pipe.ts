import { NgxGist } from './ngx-gist.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gistContent' })
export class GistContentPipe implements PipeTransform {
  public transform(value: NgxGist, key: string): string {
    const file = value.files[key];
    return file.content;
  }
}
