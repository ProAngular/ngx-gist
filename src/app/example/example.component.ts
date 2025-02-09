import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgxGistComponent } from '../public/ngx-gist.component';
import { NgxGist } from '../public/ngx-gist.model';

@Component({
  selector: 'ngx-example',
  templateUrl: './example.component.html',
  imports: [NgxGistComponent],
  standalone: true,
  styleUrl: './example.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  public readonly localGistObject = NgxGist.create({
    // Required
    files: [
      {
        content: getTimeSnippet,
        filename: 'get-time.ts',
      },
      {
        content: printHelloWorldSnippet,
        filename: 'print-hello-world.js',
      },
    ],
    // Optional
    created_at: undefined,
    languageOverride: undefined,
  });
}

const getTimeSnippet = `
function getTime(): number {
  return new Date().getTime();
}
`.trimStart();

const printHelloWorldSnippet = `
function printHelloWorld() {
  console.log('Hello world!');
}
`.trimStart();
