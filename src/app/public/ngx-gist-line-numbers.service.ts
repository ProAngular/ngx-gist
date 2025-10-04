
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import hljs, { HLJSApi } from 'highlight.js';
import { defaultIfEmpty, filter, map, Observable, firstValueFrom, from } from 'rxjs';

@Injectable({ providedIn: 'root' }) // Must be a singleton
export class NgxGistLineNumbersService {
  private readonly document: Document = inject(DOCUMENT);
  
  private isLoaded = false;

  public async load(): Promise<void> {
    if (
      this.isLoaded ||
      typeof this.document.defaultView?.hljs?.initLineNumbersOnLoad === 'function'
    ) {
      return;
    }

    try {
      if (this.document.defaultView) {
        // Ensure hljs is available before we load the dependent library
        this.document.defaultView.hljs = hljs;
      } else {
        throw new Error(`Unable to access default view to apply "highlight.js" package.`);
      }

      const result = await firstValueFrom(this.loadHljsLineNumbersLibrary());
      if (result) {
        this.document.defaultView?.hljs?.initLineNumbersOnLoad?.();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoaded = true;
    }
  }

  private loadHljsLineNumbersLibrary(): Observable<unknown> {
    return from(import('highlightjs-line-numbers.js' as const)).pipe(
      map((module) => module?.default), // Optional chaining makes it cleaner
      filter(Boolean), // `Boolean` acts as a filter to remove falsy values
      defaultIfEmpty(null)
    );
  }
}

interface HljsLineNumbersOptions {
  singleLine?: boolean;
  startFrom?: number;
}

declare global {
  interface Window {
    hljs?: HLJSApi & {
      initLineNumbersOnLoad?: (options?: HljsLineNumbersOptions) => void;
      lineNumbersBlock?: (value: Element, options?: HljsLineNumbersOptions) => void;
      lineNumbersValue?: (value: string, options?: HljsLineNumbersOptions) => string;
    };
  }
}
