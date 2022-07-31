import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' }) // Must be a singleton
export class NgxGistThemeService {
  public constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  private importElMaterialTheme: HTMLLinkElement | null = null;
  private importElHljsTheme: HTMLLinkElement | null = null;

  public setTheme({
    materialTheme,
    hilightJsTheme,
  }: {
    materialTheme?: MaterialPrebuiltTheme;
    hilightJsTheme?: HighlightJsTheme;
  } = {}): void {
    if (!materialTheme && !hilightJsTheme) {
      throw new Error('You must provide a theme.');
    }

    const materialThemeId = 'material-theme-import';
    const hljsThemeId = 'hljs-theme-import';

    const materialThemeLinkEl = this.document.getElementById(materialThemeId);
    if (materialThemeLinkEl && !hilightJsTheme) {
      // Material theme aleady exists, return.
      return;
    }

    const hljsThemeLinkEl = this.document.getElementById(hljsThemeId);
    if (hljsThemeLinkEl && hilightJsTheme === 'default' && !materialTheme) {
      // Default theme already in use, return.
      return;
    } else if (
      hljsThemeLinkEl &&
      hilightJsTheme !== 'default' &&
      !materialTheme
    ) {
      // Override previously used theme, but remove it first.
      this.document.head.removeChild(hljsThemeLinkEl);
    }
    if (materialTheme) {
      // !!! Update version when needed.
      const version = '14.1.0';
      const url = `@angular/material@${version}/prebuilt-themes/${materialTheme}.css`;
      this.importElMaterialTheme = this.document.createElement('link');
      this.importElMaterialTheme.href = `https://unpkg.com/${url}`;
      this.importElMaterialTheme.rel = 'stylesheet';
      this.importElMaterialTheme.id = materialThemeId;
      this.document.head.appendChild(this.importElMaterialTheme);
    } else if (hilightJsTheme) {
      // !!! Update version when needed.
      const version = '11.6.0';
      const url = `highlight.js@${version}/styles/${hilightJsTheme}.css`;
      this.importElHljsTheme = this.document.createElement('link');
      this.importElHljsTheme.href = `https://unpkg.com/${url}`;
      this.importElHljsTheme.rel = 'stylesheet';
      this.importElHljsTheme.id = hljsThemeId;
      this.document.head.appendChild(this.importElHljsTheme);
    }
  }
}

export type MaterialPrebuiltTheme =
  | 'deeppurple-amber'
  | 'indigo-pink'
  | 'pink-bluegrey'
  | 'purple-green';

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
