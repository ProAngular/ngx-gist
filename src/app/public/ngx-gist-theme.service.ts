import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' }) // Must be a singleton
export class NgxGistThemeService {
  public constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  private importElMaterialTheme: HTMLLinkElement | null = null;

  public setTheme(materialPrebuiltTheme: MaterialPrebuiltTheme): void {
    const themeId = 'material-theme-import';
    const currentEl = this.document.getElementById(themeId);

    if (currentEl) {
      this.document.removeChild(currentEl);
    }

    if (this.importElMaterialTheme) {
      this.document.removeChild(this.importElMaterialTheme);
    }

    this.importElMaterialTheme = this.document.createElement('link');
    this.importElMaterialTheme.href = `https://unpkg.com/@angular/material@14.1.0/prebuilt-themes/${materialPrebuiltTheme}.css`;
    this.importElMaterialTheme.media = 'screen,print';
    this.importElMaterialTheme.rel = 'stylesheet';
    this.importElMaterialTheme.type = 'text/css';
    this.importElMaterialTheme.id = themeId;

    this.document.head.appendChild(this.importElMaterialTheme);
  }
}

export type MaterialPrebuiltTheme =
  | 'deeppurple-amber'
  | 'indigo-pink'
  | 'pink-bluegrey'
  | 'purple-green';
