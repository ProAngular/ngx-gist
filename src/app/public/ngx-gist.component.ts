import { filter, firstValueFrom } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { GistFileFilterPipe } from './ngx-gist-file-filter.pipe';
import { NgxGistLineNumbersService } from './ngx-gist-line-numbers.service';
import {
  HighlightJsTheme,
  NgxGistThemeService,
} from './ngx-gist-theme.service';
import { NgxGist } from './ngx-gist.model';
import { NgxGistService } from './ngx-gist.service';
import { isNonEmptyValue } from './ngx-gist.utilities';

@Component({
  selector: 'ngx-gist',
  templateUrl: './ngx-gist.component.html',
  styleUrl: './ngx-gist.component.scss',
  imports: [GistFileFilterPipe, MatCardModule, MatTabsModule],
  providers: [NgxGistLineNumbersService, NgxGistService, NgxGistThemeService],
})
export class NgxGistComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document: Document = inject(DOCUMENT);
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly ngxGistLineNumbersService = inject(
    NgxGistLineNumbersService,
  );
  private readonly ngxGistService = inject(NgxGistService);
  private readonly ngxGistThemeService = inject(NgxGistThemeService);

  /**
   * Display in the DOM only the selected filename(s) from the gists files array.
   *
   * Default: `undefined`
   *
   * Example: `'my-styles.scss'` or `'super-feature.ts'`
   *
   * Tip: Can be either a string or string array. File names much match exactly,
   * be sure to remove any leading or trailing whitespace in the provided strings.
   */
  public readonly displayOnlyFileNames = input<string | readonly string[]>();
  /**
   * Optionally hide the gist link which opens the gist on GitHub. The gist links
   * automatically dispaly for remote gists, but can be hidden with this feature.
   *
   * Default: `false`
   */
  public readonly hideGistLink = input(false);
  /**
   * Provide a static gist model here directly which will be displayed if
   * no `gistId` is provided for remote fetching. Also this model will be
   * displayed should a fetch fail when retrieving `gistId`, or overwritten
   * once the pertaining `gistId` data is fetched.
   *
   * Default: `undefined`
   */
  public readonly gist = input<NgxGist>();
  /**
   * Provide the GitHub gist id to be fetched and loaded. This can be found in
   * URL of the gists you create. For example the id `TH1515th31DT0C0PY` in:
   * https://gist.github.com/FakeUserName/TH1515th31DT0C0PY
   *
   * Default: `undefined`
   *
   * Tip: Alternatively, provide a value directly in the sibling input `gist`.
   */
  public readonly gistId = input<string>();
  /**
   * The `highlight.js` code theme to use and display.
   *
   * Default: `undefined`
   *
   * Note: Only _one_ theme can be loaded on a single page at a time! The first
   * theme to load will apply to all gists on the page.
   */
  public readonly codeTheme = input<HighlightJsTheme>();
  /**
   * Display or hide the line numbers in your gist code snippets.
   *
   * Default: `true`
   */
  public readonly showLineNumbers = input(true);
  /**
   * Cache the GitHub gist request in local memory for 24 hours. GitHub has a
   * request limit, so this helps in reducing bandwidth. Loads previously
   * fetched gist content from the users machine on refresh and page re-visits.
   *
   * Default: `true`
   */
  public readonly useCache = input(true);

  /**
   * The gist currently on display. It starts as the `gist` input, is replaced
   * by the fetched gist once `gistId` resolves, and resets when `gist` changes.
   */
  protected readonly displayedGist = linkedSignal<NgxGist | undefined>(() =>
    this.gist(),
  );

  private readonly gistId$ = toObservable(this.gistId);

  public async ngOnInit(): Promise<void> {
    // Load theme
    this.setHljsTheme();

    // Load line numbers
    if (this.showLineNumbers()) {
      await this.ngxGistLineNumbersService.load();
    }

    // Load gist(s) async
    this.gistId$
      .pipe(filter(isNonEmptyValue), takeUntilDestroyed(this.destroyRef))
      .subscribe((gistId) => {
        void this.loadGist(gistId);
      });
  }

  private async loadGist(gistId: string): Promise<void> {
    if (this.useCache()) {
      const cachedValue = this.ngxGistService.getFromCache(gistId);
      if (cachedValue) {
        // Value is cached and not previously expired, use it.
        this.displayedGist.set(cachedValue);
        return;
      }
    }

    // Fetch and hydrate model. When the fetch fails the initial gist stays.
    const fetchedGist = await firstValueFrom(this.ngxGistService.get(gistId));
    if (!fetchedGist) {
      return;
    }
    this.displayedGist.set(fetchedGist);

    if (this.useCache()) {
      // Set value in cache for reuse saving on the amount of HTTP requests.
      // Set refresh time to be a hard coded 24 hours. This was once configurable
      // but I decided against it for simplicities sake on ease of use.
      this.ngxGistService.setToCache(fetchedGist, 1440);
    }
  }

  private setHljsTheme(): void {
    const codeTheme = this.codeTheme();
    if (!codeTheme) {
      return;
    }
    this.ngxGistThemeService.setTheme(codeTheme);
  }

  public applyLineNumbers(highlightedConent: string): SafeHtml | null {
    if (
      this.showLineNumbers() &&
      this.document.defaultView?.hljs &&
      typeof this.document.defaultView.hljs.lineNumbersValue === 'function'
    ) {
      return this.domSanitizer.bypassSecurityTrustHtml(
        this.document.defaultView.hljs.lineNumbersValue(highlightedConent),
      );
    }
    return highlightedConent;
  }
}
