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
      <!-- EXAMPLE: FETCH _NEW_ GIST FROM GITHUB (NOT-SAVED) -->
      <ngx-gist gistId="d55ea012b585a16a9970878d90106d74"></ngx-gist>
      <!-- EXAMPLE: FETCH _CACHED_ GIST FROM MEMORY (ON SUBSEQUENT REQUESTS) -->
      <ngx-gist
        gistId="d55ea012b585a16a9970878d90106d74"
        [useCache]="true"
      ></ngx-gist>
      <!-- EXAMPLE: DISPLAYING A SPECIFIC FILE -->
      <ngx-gist
        displayOnlyFileName="super.js"
        gistId="d55ea012b585a16a9970878d90106d74"
        [useCache]="true"
      ></ngx-gist>
      <!-- TODO: SUPPORT LOCAL GIST -->
      <!--
      <ngx-gist [gist]="localGistObject"></ngx-gist>
      -->
    </ngx-body>
    <ngx-footer #footer></ngx-footer>
  `,
  styles: [],
})
export class AppComponent {}
