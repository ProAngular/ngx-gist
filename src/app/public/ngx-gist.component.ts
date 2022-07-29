import { NgxGistService } from './ngx-gist.service';
import { isNonEmptyValue } from './ngx-gist.utilities';
import { NgxGist } from './ngx-gist.model';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Language } from 'highlight.js';
import { BehaviorSubject, filter, firstValueFrom, ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DOCUMENT } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'ngx-gist',
  template: `
    <mat-card class="code-container">
      <mat-tab-group *ngIf="gistChanges | async as gist; else loading">
        <mat-tab
          *ngFor="
            let file of gist.highlightedFiles
              | gistFileFilter: displayOnlyFileName
          "
          [label]="file.filename"
        >
          <pre>
            <code [innerHTML]="file.highlightedContent"></code>
          </pre>
        </mat-tab>
      </mat-tab-group>
      <mat-card-footer>
        <a
          *ngIf="gistIdChanges | async as gid"
          target="_blank"
          [href]="'https://gist.github.com/' + gid"
        >
          <mat-icon>link</mat-icon> Open Gist on GitHub
        </a>
      </mat-card-footer>
      <ng-template #loading> Loading Code Snippet... </ng-template>
    </mat-card>
  `,
  styleUrls: ['./ngx-gist.component.scss'],
})
export class NgxGistComponent implements OnInit {
  public constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
    private readonly ngxGistService: NgxGistService,
  ) {}

  public codeSnippet: string | null = null;
  private htmlLinkElement: HTMLLinkElement | null = null;

  /**
   * Display in the DOM only the selected filename from the gists files array.
   *
   * TODO: Make this possible for string array input.
   *
   * Default: `undefined`
   */
  @Input() public displayOnlyFileName?: string;
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
   * Alternatively, provide a value directly in the sibling input `gist`.
   */
  @Input() public set gistId(value: string) {
    this.gistIdSubject.next(value);
  }
  // We want reactive behavior for `gistId` so we can update gists asynchronously
  private readonly gistIdSubject = new ReplaySubject<
    NgxGistComponent['gistId']
  >(1);
  public readonly gistIdChanges = this.gistIdSubject.asObservable();
  /**
   * When defined, override automatic language detection [and styling] and
   * treat all gists as this lanuage.
   *
   * See supported languages here:
   * https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
   *
   * Default: `undefined`
   */
  @Input() public languageName?: Language['name'];
  /**
   * Define a material core theme to apply. Ideally, you should already have
   * your global material theme set at the root of your project so try to
   * avoid using this if possible. Note: These are also loaded from a CDN.
   *
   * See theming Angular Material: https://material.angular.io/guide/theming
   *
   * CDN used: `https://unpkg.com`
   *
   * Default: `undefined`
   */
  @Input() public materialTheme:
    | 'deeppurple-amber'
    | 'indigo-pink'
    | 'pink-bluegrey'
    | 'purple-green'
    | undefined = undefined;
  /**
   * Cache the GitHub gist request in local memory for 24 hours. GitHub has a
   * request limit, so this helps in reducing bandwidth. Loads previously
   * fetched gist content from the users machine.
   *
   * Default: `true`
   */
  @Input() public useCache = true;

  public async ngOnInit(): Promise<void> {
    this.setTheme();

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

    this.htmlLinkElement = this.document.createElement('link');
    this.htmlLinkElement.href = `https://unpkg.com/@angular/material@14.1.0/prebuilt-themes/${this.materialTheme}.css`;
    this.htmlLinkElement.media = 'screen,print';
    this.htmlLinkElement.rel = 'stylesheet';
    this.htmlLinkElement.type = 'text/css';
    this.document.head.appendChild(this.htmlLinkElement);
  }
}
