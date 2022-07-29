import { NgxGistService } from './ngx-gist.service';
import { isNonEmptyValue } from './ngx-gist.utilities';
import { NgxGist } from './ngx-gist.model';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Language, default as hljs } from 'highlight.js';
import { filter, firstValueFrom, ReplaySubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DOCUMENT } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'ngx-gist',
  template: `
    <mat-card class="code-container">
      <!-- TODO: LOADING ICON OR MESSAGE -->
      <mat-tab-group *ngIf="gist as g">
        <mat-tab
          *ngFor="
            let file of g.files | gistFileFilter: displayOnlyFileName | keyvalue
          "
          [label]="file.key"
        >
          <pre>
            <code 
              [innerHTML]="getHighlightJsContent(g | gistContent: file.key)"
            ></code>
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
  @Input() public gist?: NgxGist;
  // We want reactive behavior for `gistId` so we can update gists asynchronously
  private readonly gistIdSubject = new ReplaySubject<
    NgxGistComponent['gistId']
  >(1);
  public readonly gistIdChanges = this.gistIdSubject.asObservable();
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

  // TODO: Work on speeding this call up. Or possibly pre-render instead.
  public getHighlightJsContent(value: string): string {
    const userSpecifiedLanguage = this.languageName;
    if (userSpecifiedLanguage) {
      return hljs.highlight(value, { language: userSpecifiedLanguage }).value;
    }

    return hljs.highlightAuto(value).value;
  }

  private async fetchAndSetGist(gistId: string): Promise<void> {
    // Use the initial gist model as a fallback for a failed fetch. This
    // enables us to have a fallback gist snippet should we be offline or
    // the data is unavailable for some reason.
    const initialGist = this.gist ? { ...this.gist } : undefined;

    // Fetch and hydrate model or fallback to initial gist.
    this.gist =
      (await firstValueFrom(this.ngxGistService.get(gistId))) ?? initialGist;

    if (this.useCache && this.gist) {
      // Set value in cache for reuse saving on the amount of HTTP requests.
      // Set refresh time to be a hard coded 24 hours. This was once configurable
      // but I decided against it for simplicities sake on ease of use.
      this.ngxGistService.setToCache(this.gist, 1440);
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
