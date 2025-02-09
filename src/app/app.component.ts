import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ExampleComponent } from './example/example.component';
import { BodyComponent, FooterComponent, HeaderComponent } from './layout';

@Component({
  selector: 'ngx-root',
  imports: [
    BodyComponent,
    ExampleComponent,
    FooterComponent,
    HeaderComponent,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
