import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGistComponent } from './ngx-gist.component';
import { NgxGistService } from './ngx-gist.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { GistContentPipe } from './ngx-gist-content.pipe';
import { GistFileFilterPipe } from './ngx-gist-file-filter.pipe';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [NgxGistComponent, GistContentPipe, GistFileFilterPipe],
  imports: [
    // Needs to be imported at root.
    // BrowserAnimationsModule,
    CommonModule,
    // Needs to be imported at root.
    // HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
  ],
  exports: [NgxGistComponent],
  providers: [NgxGistService],
})
export class NgxGistModule {}
