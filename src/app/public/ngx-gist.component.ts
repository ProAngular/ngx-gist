import { BehaviorSubject, filter, firstValueFrom, ReplaySubject } from 'rxjs';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GistFileFilterPipe } from './ngx-gist-file-filter.pipe';
import { HighlightJsTheme, NgxGistThemeService } from './ngx-gist-theme.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxGist } from './ngx-gist.model';
import { NgxGistLineNumbersService } from './ngx-gist-line-numbers.service';
import { NgxGistService } from './ngx-gist.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isNonEmptyValue } from './ngx-gist.utilities';

@UntilDestroy()
@Component({
  selector: 'ngx-gist',
  templateUrl: './ngx-gist.component.html',
  styleUrl: './ngx-gist.component.scss',
  standalone: true,
  imports: [
      CommonModule,
      GistFileFilterPipe,
      MatCardModule,
      MatTabsModule,
  ],
  providers: [
    NgxGistLineNumbersService,
    NgxGistService,
    NgxGistThemeService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGistComponent implements OnInit {
  private readonly document: Document = inject(DOCUMENT);
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly ngxGistLineNumbersService = inject(NgxGistLineNumbersService);
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
  @Input() public displayOnlyFileNames?: string | readonly string[];
  /**
   * Optionally hide the gist link which opens the gist on GitHub. The gist links
   * automatically dispaly for remote gists, but can be hidden with this feature.
   *
   * Default: `false`
   */
  @Input() public hideGistLink = false;
  /**
   * Provide a static gist model here directly which will be displayed if
   * no `gistId` is provided for remote fetching. Also this model will be
   * displayed should a fetch fail when retrieving `gistId`, or overwritten
   * once the pertaining `gistId` data is fetched.
   *
   * Default: `undefined`
   */
  @Input() public set gist(value: NgxGist | undefined) {
    this.gistSubject.next(value);
  }
  private readonly gistSubject = new BehaviorSubject<NgxGistComponent['gist']>(
    undefined,
  );
  public readonly gistChanges = this.gistSubject.asObservable();
  /**
   * Provide the GitHub gist id to be fetched and loaded. This can be found in
   * URL of the gists you create. For example the id `TH1515th31DT0C0PY` in:
   * https://gist.github.com/FakeUserName/TH1515th31DT0C0PY
   *
   * Default: `undefined`
   *
   * Tip: Alternatively, provide a value directly in the sibling input `gist`.
   */
  @Input() public set gistId(value: string) {
    this.gistIdSubject.next(value);
  }
  private readonly gistIdSubject = new ReplaySubject<
    NgxGistComponent['gistId']
  >(1);
  public readonly gistIdChanges = this.gistIdSubject.asObservable();
  /**
   * The `highlight.js` code theme to use and display.
   *
   * Default: `undefined`
   *
   * Note: Only _one_ theme can be loaded on a single page at a time! The first
   * theme to load will apply to all gists on the page.
   */
  @Input() public codeTheme?: HighlightJsTheme;
  /**
   * Display or hide the line numbers in your gist code snippets.
   *
   * Default: `true`
   */
  @Input() public showLineNumbers = true;
  /**
   * Cache the GitHub gist request in local memory for 24 hours. GitHub has a
   * request limit, so this helps in reducing bandwidth. Loads previously
   * fetched gist content from the users machine on refresh and page re-visits.
   *
   * Default: `true`
   */
  @Input() public useCache = true;

  public async ngOnInit(): Promise<void> {
    // Load theme
    this.setHljsTheme();

    // Load line numbers
    if (this.showLineNumbers) {
      await this.ngxGistLineNumbersService.load();
    }

    // Load gist(s) async
    this.gistIdChanges
      .pipe(filter(isNonEmptyValue), untilDestroyed(this))
      .subscribe(async (gistId) => {
        if (this.useCache) {
          const cachedValue = this.ngxGistService.getFromCache(gistId);
          if (cachedValue) {
            // Value is cached and not previously expired, use it.
            this.gist = cachedValue;
            return;
          }
        }

        await this.fetchAndSetGist(gistId);
      });
  }

  private async fetchAndSetGist(gistId: string): Promise<void> {
    // Fetch and hydrate model or fallback to initial gist.
    const fetcheGist =
      (await firstValueFrom(this.ngxGistService.get(gistId))) ?? undefined;
    this.gist = fetcheGist;

    if (this.useCache && fetcheGist) {
      // Set value in cache for reuse saving on the amount of HTTP requests.
      // Set refresh time to be a hard coded 24 hours. This was once configurable
      // but I decided against it for simplicities sake on ease of use.
      this.ngxGistService.setToCache(fetcheGist, 1440);
    }
  }

  private setHljsTheme(): void {
    if (!this.codeTheme) {
      return;
    }
    this.ngxGistThemeService.setTheme(this.codeTheme);
  }

  public applyLineNumbers(highlightedConent: string): SafeHtml | null {
    if (
      this.showLineNumbers &&
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
