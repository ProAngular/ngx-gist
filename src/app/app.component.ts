import { NgxGist } from './public/ngx-gist.model';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-app',
  template: `
    <ngx-header></ngx-header>
    <ngx-body>
      <h2 align="center">@proangular/ngx-gist</h2>
      <h3 align="center">
        Examples of displaying local and GitHub gists and code snippets.
      </h3>

      <hr />

      <h4>FETCHED GIST (AUTO CACHED FOR 24 HOURS)</h4>
      <ngx-gist gistId="d55ea012b585a16a9970878d90106d74"></ngx-gist>

      <h4>FETCHED GIST (FORCED NO CACHE)</h4>
      <ngx-gist
        gistId="d55ea012b585a16a9970878d90106d74"
        [useCache]="false"
      ></ngx-gist>

      <h4>DISPLAYING ONE SPECIFIC FILE</h4>
      <p>Display only one specific file when your gist has many.</p>
      <ngx-gist
        displayOnlyFileNames="super.js"
        gistId="d55ea012b585a16a9970878d90106d74"
      ></ngx-gist>

      <h4>DISPLAYING MULTIPLE, SPECIFIC FILES</h4>
      <p>You can also display any number of specific files by name.</p>
      <ngx-gist
        [displayOnlyFileNames]="['csstest.css', 'main.ts']"
        gistId="d55ea012b585a16a9970878d90106d74"
      ></ngx-gist>

      <h4>DISPLAYING A BASIC CODE SNIPPET (WITHOUT A REMOTE GIST)</h4>
      <p>
        These are not fetched from GitHub and are brought in elsewhere from your
        application (seperate HTTP request, or statically for example). With
        this method you can display code snippets without having to create a
        remote gist. Also, please notice here that no "Open Gist on GitHub" link
        is displayed here.
      </p>
      <ngx-gist [gist]="localGistObject"></ngx-gist>
    </ngx-body>
    <ngx-footer #footer></ngx-footer>
  `,
  styles: [
    `
      h2 {
        margin-top: 2rem;
      }
      h3 {
        margin-bottom: 3rem;
      }
    `,
  ],
})
export class AppComponent {
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
