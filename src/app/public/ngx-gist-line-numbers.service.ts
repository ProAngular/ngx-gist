import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import hljs, { HLJSApi } from 'highlight.js';
import { filter, map, Observable, firstValueFrom, from } from 'rxjs';

@Injectable({ providedIn: 'root' }) // Must be a singleton
export class NgxGistLineNumbersService {
  public constructor(@Inject(DOCUMENT) private readonly document: Document) {}
  private isLoaded = false;

  public async load(): Promise<void> {
    if (
      this.isLoaded ||
      typeof this.document.defaultView?.hljs?.initLineNumbersOnLoad ===
        'function'
    ) {
      return;
    }

    try {
      if (this.document.defaultView) {
        // Ensure hljs is available before we load the dependant library
        // `highlightjs-line-numbers.js` dynamically as a js import.
        this.document.defaultView.hljs = hljs;
      } else {
        throw new Error(
          `Unable to access default view to apply "highlight.js" package.`,
        );
      }

      await firstValueFrom(this.loadHljsLineNumbersLibrary()).then(() => {
        // The library `highlightjs-line-numbers.js` adds new functions to the
        // `highlight.js` scope on load, so we should now be able to call it
        // without failure.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.document.defaultView?.hljs?.initLineNumbersOnLoad!();
      });
    } catch (e: unknown) {
      console.error(e);
    } finally {
      this.isLoaded = true;
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  private loadHljsLineNumbersLibrary(): Observable<any> {
    return from(import('highlightjs-line-numbers.js' as any)).pipe(
      filter((module: any) => !!module && !!module.default),
      map((module: any) => module.default),
    );
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

declare global {
  interface Window {
    hljs?: HLJSApi & {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      initLineNumbersOnLoad?: (options?: any) => void;
      lineNumbersBlock?: (value: Element, options?: any) => void;
      lineNumbersValue?: (value: string, options?: any) => string;
      /* eslint-enable @typescript-eslint/no-explicit-any */
    };
  }
}
