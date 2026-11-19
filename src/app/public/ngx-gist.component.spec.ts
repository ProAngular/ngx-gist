import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGistLineNumbersService } from './ngx-gist-line-numbers.service';
import { NgxGistThemeService } from './ngx-gist-theme.service';
import { NgxGistComponent } from './ngx-gist.component';
import { NgxGist } from './ngx-gist.model';
import { NgxGistService } from './ngx-gist.service';
import { gistResponse } from './ngx-gist.testing';

@Component({
  selector: 'ngx-test-host',
  imports: [NgxGistComponent],
  template: `
    <ngx-gist
      [displayOnlyFileNames]="names()"
      [gist]="gist()"
      [gistId]="gistId()"
      [hideGistLink]="hideLink()"
      [showLineNumbers]="false"
      [useCache]="useCache()"
    />
  `,
})
class TestHostComponent {
  public readonly gist = signal<NgxGist | undefined>(undefined);
  public readonly gistId = signal<string | undefined>(undefined);
  public readonly hideLink = signal(false);
  public readonly names = signal<string | readonly string[] | undefined>(
    undefined,
  );
  public readonly useCache = signal(true);
}

const url = 'https://api.github.com/gists/abc123';

describe('NgxGistComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let http: HttpTestingController;

  const localGist = NgxGist.create({
    files: [{ content: 'let local = 1;', filename: 'local.js' }],
  });

  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        public observe = vi.fn();
        public unobserve = vi.fn();
        public disconnect = vi.fn();
      },
    );
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    TestBed.overrideComponent(NgxGistComponent, {
      set: {
        providers: [
          {
            provide: NgxGistLineNumbersService,
            useValue: { load: () => Promise.resolve() },
          },
          NgxGistService,
          NgxGistThemeService,
        ],
      },
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  async function settle(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      fixture.detectChanges();
      await fixture.whenStable();
    }
  }

  function root(): HTMLElement {
    return fixture.nativeElement as HTMLElement;
  }

  function tabLabels(): string[] {
    return Array.from(root().querySelectorAll('[role="tab"]')).map((tab) =>
      (tab.textContent ?? '').trim(),
    );
  }

  it('shows the loading text before any gist is available', async () => {
    await settle();
    expect(root().textContent).toContain('Loading Code Snippet...');
    expect(tabLabels()).toEqual([]);
  });

  it('renders a static gist without any request', async () => {
    host.gist.set(localGist);
    await settle();
    expect(tabLabels()).toEqual(['local.js']);
    expect(root().querySelector('code')?.textContent).toContain('let local');
    expect(root().querySelector('mat-card-footer')).toBeNull();
    http.verify();
  });

  it('fetches a remote gist and renders each file as a tab', async () => {
    host.gistId.set('abc123');
    await settle();
    http.expectOne(url).flush(gistResponse());
    await settle();
    expect(tabLabels()).toEqual(['hello.ts', 'style.css']);
    expect(root().querySelector('code')?.textContent).toContain('hello');
    const link = root().querySelector('mat-card-footer a');
    expect(link?.getAttribute('href')).toBe('https://gist.github.com/abc123');
    expect(localStorage.getItem('gist||abc123')).not.toBeNull();
  });

  it('reads a non expired gist from the cache instead of fetching', async () => {
    localStorage.setItem(
      'gist||abc123',
      JSON.stringify({
        expiration: Date.now() + 60_000,
        value: gistResponse(),
      }),
    );
    host.gistId.set('abc123');
    await settle();
    http.expectNone(url);
    expect(tabLabels()).toEqual(['hello.ts', 'style.css']);
  });

  it('skips the cache when useCache is false', async () => {
    localStorage.setItem(
      'gist||abc123',
      JSON.stringify({
        expiration: Date.now() + 60_000,
        value: gistResponse(),
      }),
    );
    host.useCache.set(false);
    host.gistId.set('abc123');
    await settle();
    http.expectOne(url).flush(gistResponse());
    await settle();
    expect(tabLabels()).toEqual(['hello.ts', 'style.css']);
  });

  it('keeps the static gist when the fetch fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    host.gist.set(localGist);
    host.gistId.set('abc123');
    await settle();
    http
      .expectOne(url)
      .flush('nope', { status: 500, statusText: 'Server Error' });
    await settle();
    expect(tabLabels()).toEqual(['local.js']);
  });

  it('only displays the requested file names', async () => {
    host.names.set(['style.css']);
    host.gistId.set('abc123');
    await settle();
    http.expectOne(url).flush(gistResponse());
    await settle();
    expect(tabLabels()).toEqual(['style.css']);
  });

  it('hides the gist link when hideGistLink is set', async () => {
    host.hideLink.set(true);
    host.gistId.set('abc123');
    await settle();
    http.expectOne(url).flush(gistResponse());
    await settle();
    expect(root().querySelector('mat-card-footer a')).toBeNull();
  });
});
