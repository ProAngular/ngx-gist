import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxGistModule } from './public/ngx-gist.module';
import { BodyComponent, FooterComponent, HeaderComponent } from './layout';

@NgModule({
  declarations: [AppComponent, BodyComponent, FooterComponent, HeaderComponent],
  imports: [BrowserModule, NgxGistModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
