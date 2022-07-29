import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxGistModule } from './public/ngx-gist.module';
import { BodyComponent, FooterComponent, HeaderComponent } from './layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, BodyComponent, FooterComponent, HeaderComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    NgxGistModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
