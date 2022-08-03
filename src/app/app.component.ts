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
      <p>
        ngx-gist will fetch the gist once and store it locally for 24 hours. In
        that timeframe, if the user returns or visits another page where this
        gist was previously loaded, it will reload the content without having to
        reach out to GitHub again.
      </p>
      <ngx-gist gistId="d55ea012b585a16a9970878d90106d74"></ngx-gist>

      <h4>FETCHED GIST (FORCED NO CACHE)</h4>
      <p>
        Force no cache. This will force ngx-gist to retrieve the content live
        from GitHub every time this content loads. This is disabled by default,
        but could be useful if your gists change frequently.
      </p>
      <ngx-gist
        gistId="d55ea012b585a16a9970878d90106d74"
        [useCache]="false"
      ></ngx-gist>

      <h4>SETTING THE CODE STYLE THEME</h4>
      <p>
        Select a "highlight.js" code theme to apply. Note: Only one theme can be
        loaded on a single page at a time! The first theme to load will apply to
        all gists on the page.
      </p>
      <ngx-gist
        codeTheme="github"
        gistId="d55ea012b585a16a9970878d90106d74"
      ></ngx-gist>

      <h4>DISPLAYING ONE SPECIFIC FILE</h4>
      <p>Display only one specific file when your gist has many.</p>
      <ngx-gist
        displayOnlyFileNames="javascript.js"
        gistId="d55ea012b585a16a9970878d90106d74"
      ></ngx-gist>

      <h4>DISPLAYING MULTIPLE, SPECIFIC FILES</h4>
      <p>You can also display any number of specific files by name.</p>
      <ngx-gist
        [displayOnlyFileNames]="[
          'markup.html',
          'typescript.ts',
          'stylesheet.scss'
        ]"
        gistId="d55ea012b585a16a9970878d90106d74"
      ></ngx-gist>

      <h4>DISPLAYING A BASIC CODE SNIPPET (WITHOUT A REMOTE GIST)</h4>
      <p>
        These are not fetched from GitHub and are brought in elsewhere from your
        application (seperate HTTP request, or statically for example). With
        this method you can display code snippets without having to create a
        remote gist. You can easily create a new code snippet/gist object using
        <code>NgxGist.create({{ '{' }} ... {{ '}' }})</code>. Note: no "Open
        Gist on GitHub" link will display.
      </p>
      <ngx-gist [gist]="localGistObject"></ngx-gist>

      <h4>HIDING LINE NUMBERS</h4>
      <p>
        Line numbers are enabled by default, but you can turn them off like so.
      </p>
      <ngx-gist
        gistId="d55ea012b585a16a9970878d90106d74"
        [showLineNumbers]="false"
      ></ngx-gist>
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
