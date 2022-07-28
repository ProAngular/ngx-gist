import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  template: `
    <footer [style.height]="height + 'px'">
      <a href="https://www.ProAngular.com" target="_blank">
        <img src="assets/images/pro-angular-logo.png" />
      </a>
      <p>
        Copyright &copy; Pro Angular 2022
        {{ currentYear > 2022 ? ' - ' + currentYear : '' }}
      </p>
      <p>
        Pro Angular is not affiliated, associated, authorized, endorsed by, or
        in any way officially connected with Angular, or any of its subsidiaries
        or its affiliates.
        <br />
        The official Angular website can be found at
        <a href="https://angular.io/" rel="nofollow noreferrer" target="_blank"
          >https://angular.io/</a
        >. The names Angular as well as related names, marks, emblems and images
        are registered trademarks of their respective owners.
      </p>
    </footer>
  `,
  styles: [
    `
      footer {
        background-color: #1775d1;
        text-align: center;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class FooterComponent {
  public readonly currentYear = new Date().getFullYear();
  public readonly height = 420;
}
