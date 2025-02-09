import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  standalone: true,
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  public readonly currentYear = new Date().getFullYear();
}
