import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxGistModule } from './public/ngx-gist.module';
import { BodyComponent, FooterComponent, HeaderComponent } from './layout';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

@NgModule({
  declarations: [AppComponent, BodyComponent, FooterComponent, HeaderComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    NgxGistModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
