import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' }) // Must be a singleton
export class NgxGistThemeService {
  public constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  private importElHljsTheme: HTMLLinkElement | null = null;

  public setTheme(hilightJsTheme: HighlightJsTheme): void {
    const hljsThemeId = 'hljs-theme-import';
    const hljsThemeLinkEl = this.document.getElementById(hljsThemeId);

    if (hljsThemeLinkEl && hilightJsTheme === 'default') {
      // Default theme already in use, return.
      return;
    } else if (
      hljsThemeLinkEl &&
      hilightJsTheme !== 'default'
    ) {
      // Override previously used theme, but remove it first.
      this.document.head.removeChild(hljsThemeLinkEl);
    }

    const version = '11.11.1'; // Update with version!
    const url = `highlight.js@${version}/styles/${hilightJsTheme}.css`;
    this.importElHljsTheme = this.document.createElement('link');
    this.importElHljsTheme.href = `https://unpkg.com/${url}`;
    this.importElHljsTheme.rel = 'stylesheet';
    this.importElHljsTheme.id = hljsThemeId;
    this.document.head.appendChild(this.importElHljsTheme);
  }
}

export type HighlightJsTheme =
  | 'a11y-dark'
  | 'a11y-light'
  | 'agate'
  | 'androidstudio'
  | 'an-old-hope'
  | 'arduino-light'
  | 'arta'
  | 'ascetic'
  | 'atom-one-dark'
  | 'atom-one-dark-reasonable'
  | 'atom-one-light'
  | 'brown-paper'
  | 'codepen-embed'
  | 'color-brewer'
  | 'dark'
  | 'default'
  | 'devibeans'
  | 'docco'
  | 'far'
  | 'felipec'
  | 'foundation'
  | 'github'
  | 'github-dark'
  | 'github-dark-dimmed'
  | 'gml'
  | 'googlecode'
  | 'gradient-dark'
  | 'gradient-light'
  | 'grayscale'
  | 'hybrid'
  | 'idea'
  | 'intellij-light'
  | 'ir-black'
  | 'isbl-editor-dark'
  | 'isbl-editor-light'
  | 'kimbie-dark'
  | 'kimbie-light'
  | 'lightfair'
  | 'lioshi'
  | 'magula'
  | 'mono-blue'
  | 'monokai'
  | 'monokai-sublime'
  | 'night-owl'
  | 'nnfx-dark'
  | 'nnfx-light'
  | 'nord'
  | 'obsidian'
  | 'panda-syntax-dark'
  | 'panda-syntax-light'
  | 'paraiso-dark'
  | 'paraiso-light'
  | 'pojoaque'
  | 'purebasic'
  | 'qtcreator-dark'
  | 'qtcreator-light'
  | 'rainbow'
  | 'routeros'
  | 'school-book'
  | 'shades-of-purple'
  | 'srcery'
  | 'stackoverflow-dark'
  | 'stackoverflow-light'
  | 'sunburst'
  | 'tokyo-night-dark'
  | 'tokyo-night-light'
  | 'tomorrow-night-blue'
  | 'tomorrow-night-bright'
  | 'vs'
  | 'vs2015'
  | 'xcode'
  | 'xt256';
