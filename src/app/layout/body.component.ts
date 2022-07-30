import { Component } from '@angular/core';

@Component({
  selector: 'ngx-body',
  template: `
    <section>
      <ng-content></ng-content>
    </section>
  `,
  styles: [
    `
      section {
        padding: 1rem;
        min-height: 90vh;
        margin-top: 64px;
      }
    `,
  ],
})
export class BodyComponent {
  public readonly Array = Array;
}
