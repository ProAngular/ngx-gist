import { Component } from '@angular/core';

@Component({
  selector: 'ngx-header',
  template: `
    <mat-toolbar class="mat-elevation-z6">
      <mat-toolbar-row>
        <a class="logo" href="https://www.ProAngular.com" target="_blank">
          <img
            src="https://www.proangular.com/assets/images/pro-angular-logo-full.png"
          />
        </a>
        <div class="github-link-container">
          <a
            href="https://github.com/ProAngular/ngx-gist"
            aria-label="GitHub Repo"
            target="_blank"
          >
            <img
              class="git-hub"
              src="https://www.proangular.com/assets/images/git-hub.svg"
            />
          </a>
        </div>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styles: [
    `
      :host,
      mat-toolbar {
        position: fixed;
        background-color: #1775d1;
        padding: 0;
        z-index: 1000;
        width: 100%;
        height: 64px;
        top: 0;
      }
      a.logo,
      img.git-hub {
        height: 40px;
      }
      .github-link-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        min-width: 6.5rem;
        height: 100%;
        margin-right: 1rem;
        position: relative;
        margin: 0;

        > a {
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
      }
    `,
  ],
})
export class HeaderComponent {}
