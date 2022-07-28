import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxGistComponent } from './ngx-gist.component';
import { NgxGistService } from './ngx-gist.service';

@NgModule({
  declarations: [NgxGistComponent],
  imports: [CommonModule],
  exports: [NgxGistComponent],
  providers: [NgxGistService],
})
export class NgxGistModule {}
