import { NgxGistService } from './ngx-gist.service';
import { isNonEmptyValue } from './ngx-gist.utilities';
import { NgxGist } from './ngx-gist.model';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Language } from 'highlight.js';
import { BehaviorSubject, filter, firstValueFrom, ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DOCUMENT } from '@angular/common';
import { NgxGistLineNumbersService } from './ngx-gist-line-numbers.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  MaterialPrebuiltTheme,
  NgxGistThemeService,
} from './ngx-gist-theme.service';

@UntilDestroy()
@Component({
  selector: 'ngx-gist',
  template: `
    <mat-card class="code-container">
      <mat-tab-group *ngIf="gistChanges | async as gist; else loading">
        <mat-tab
          *ngFor="
            let file of gist.highlightedFiles
              | gistFileFilter: displayOnlyFileNames
          "
          [label]="file.filename"
        >
          <pre>
            <code 
              *ngIf="applyLineNumbers(file.highlightedContent) as content"
              [innerHTML]="content"
            ></code>
            <ng-template #error>
              <code>Error loading code...</code>
            </ng-template>
          </pre>
        </mat-tab>
      </mat-tab-group>

      <mat-card-footer *ngIf="gistIdChanges | async as gid">
        <a
          *ngIf="!hideGistLink"
          target="_blank"
          [href]="'https://gist.github.com/' + gid"
        >
          <mat-icon>link</mat-icon> Open Gist on GitHub
        </a>
      </mat-card-footer>

      <ng-template #loading>Loading Code Snippet...</ng-template>
    </mat-card>
  `,
  styleUrls: ['./ngx-gist.component.scss'],
})
export class NgxGistComponent implements OnInit {
  public constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly domSanitizer: DomSanitizer,
    private readonly ngxGistService: NgxGistService,
    private readonly ngxGistLineNumbersService: NgxGistLineNumbersService,
    private readonly ngxGistThemeService: NgxGistThemeService,
  ) {}

  // TODO: Apply HighlightJs code theme.
  // @Input() public codeTheme?: unknown;

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
   * When defined, override automatic language detection [and styling] and
   * treat all gists as this lanuage.
   *
   * Default: `undefined`
   *
   * Tip: See supported language strings here:
   * https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
   */
  @Input() public languageName?: Language['name'];
  /**
   * Define a material core theme to apply. Ideally, you should already have
   * your global material theme set at the root of your project so try to
   * avoid using this if possible.
   *
   * Note: These are loaded from the CDN: `https://unpkg.com`
   *
   * Default: `undefined`
   *
   * Tip: See theming Angular Material: https://material.angular.io/guide/theming
   * if you need help applying a global material theme.
   */
  @Input() public materialTheme?: MaterialPrebuiltTheme;
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
    this.setTheme();

    if (this.showLineNumbers) {
      await this.ngxGistLineNumbersService.load();
    }

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

  private setTheme(): void {
    if (!this.materialTheme) {
      return;
    }
    this.ngxGistThemeService.setTheme(this.materialTheme);
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
