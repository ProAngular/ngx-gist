import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGistComponent } from './ngx-gist.component';
import { NgxGistService } from './ngx-gist.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { GistFileFilterPipe } from './ngx-gist-file-filter.pipe';
import { NgxGistLineNumbersService } from './ngx-gist-line-numbers.service';
import { NgxGistThemeService } from './ngx-gist-theme.service';

@NgModule({
  declarations: [NgxGistComponent, GistFileFilterPipe],
  imports: [
    // Needs to be imported at root. See `README.md` for more info.
    // BrowserAnimationsModule,
    // HttpClientModule,
    CommonModule,
    MatCardModule,
    MatTabsModule,
  ],
  exports: [NgxGistComponent],
  providers: [NgxGistLineNumbersService, NgxGistService, NgxGistThemeService],
})
export class NgxGistModule {}
