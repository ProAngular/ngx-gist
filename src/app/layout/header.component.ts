import { Component } from '@angular/core';

@Component({
  selector: 'ngx-header',
  template: `
    <header>
      <a href="https://www.ProAngular.com" target="_blank">
        <img src="assets/images/pro-angular-logo-full.png" />
      </a>
    </header>
  `,
  styles: [
    `
      header {
        background-color: #1775d1;
        padding: 0.5rem 1rem;
      }
    `,
  ],
})
export class HeaderComponent {}
