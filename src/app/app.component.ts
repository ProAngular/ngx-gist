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
      <!-- EXAMPLE: FETCH GIST FROM GITHUB -->
      <ngx-gist></ngx-gist>
      <!-- EXAMPLE: LOCAL GIST -->
      <ngx-gist></ngx-gist>
      <!-- EXAMPLE: DISPLAYING SPECIFIC FILES -->
      <ngx-gist></ngx-gist>
    </ngx-body>
    <ngx-footer #footer></ngx-footer>
  `,
  styles: [],
})
export class AppComponent {}
