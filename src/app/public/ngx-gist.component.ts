import { NgxGistService } from './ngx-gist.service';
import { isNonEmptyValue } from './ngx-gist.utilities';
import { NgxGist } from './ngx-gist.model';
import { Component, Input, OnInit } from '@angular/core';
import { Language, default as hljs } from 'highlight.js';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ngx-gist',
  template: `
    <mat-card class="code-container">
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
          *ngIf="gistId && gist"
          target="_blank"
          [href]="'https://gist.github.com/' + gistId"
        >
          <mat-icon>link</mat-icon> Open Gist on GitHub
        </a>
      </mat-card-footer>
    </mat-card>
  `,
  styleUrls: ['./ngx-gist.component.scss'],
})
export class NgxGistComponent implements OnInit {
  public constructor(public readonly ngxGistService: NgxGistService) {}

  public codeSnippet: string | null = null;

  /**
   * Cache the GitHub gist request in local memory. GitHub has a request
   * limit so using this is wise in making sure users always get the content,
   * especially on quick refreshes or having multiple gist snippets on page.
   */
  @Input() public cacheForMin?: number;

  /**
   * Display in the DOM only the selected filename.
   */
  @Input() public displayOnlyFileName?: string;

  /**
   * Provide a static gist model here directly which will be displayed if
   * no `gistId` is provided for remote fetching. Also this model will be
   * displayed should a fetch fail when retrieving `gistId`, or overwritten
   * once the pertaining `gistId` data is fetched.
   */
  @Input() public gist?: NgxGist;

  // We want reactive behavior for `gistId` so we can update gists asynchronously
  private readonly gistIdSubject = new BehaviorSubject<
    NgxGistComponent['gistId']
  >(null);

  /**
   * Provide the GitHub gist id to be fetched and loaded. This can be found in
   * URL of the gists you create. For example the id `TH1515th31DT0C0PY` in:
   * https://gist.github.com/FakeUserName/TH1515th31DT0C0PY
   *
   * Alternatively, provide a value directly in the sibling input `gist`.
   */
  @Input() public set gistId(value: string | null) {
    this.gistIdSubject.next(value);
  }

  @Input() public languageName?: Language['name'];

  public async ngOnInit(): Promise<void> {
    this.gistIdSubject
      .pipe(filter(isNonEmptyValue), untilDestroyed(this))
      .subscribe(async (gistId) => {
        // Use the initial gist model as a fallback for a failed fetch. This
        // enables us to have a fallback gist snippet should we be offline or
        // the data is unavailable for some reason.
        const initialGist = this.gist ? { ...this.gist } : undefined;
        // Fetch and hydrate model or fallback to initial gist.
        this.gist =
          (await firstValueFrom(this.ngxGistService.get(gistId))) ??
          initialGist;
      });
  }

  public getHighlightJsContent(value: string): string {
    const userSpecifiedLanguage = this.languageName;

    if (userSpecifiedLanguage) {
      return hljs.highlight(value, { language: userSpecifiedLanguage }).value;
    }

    return hljs.highlightAuto(value).value;
  }
}
