import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'ngx-header',
  standalone: true,
  imports: [MatToolbarModule],
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html',
})
export class HeaderComponent {}
