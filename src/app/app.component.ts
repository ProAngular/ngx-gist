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
      <!-- EXAMPLE: LOCAL GIST -->
      <!-- EXAMPLE: FETCH GIST FROM GITHUB -->
      <ngx-gist
        gistId="d55ea012b585a16a9970878d90106d74"
        displayOnlyFileName="super.js"
      ></ngx-gist>
      <!-- EXAMPLE: DISPLAYING SPECIFIC FILES -->
    </ngx-body>
    <ngx-footer #footer></ngx-footer>
  `,
  styles: [],
})
export class AppComponent {}
