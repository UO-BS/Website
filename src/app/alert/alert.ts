import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  template: `
    <div class="alertBody">
      <header class="alertTitle"> {{ alertTitle() }} </header>
      <p class="alertText"> {{ alertText() }} </p>
    </div>
  `,
  styleUrls: ['./alert.css'],
})
export class Alert {
  alertTitle = input.required<string>();
  alertText = input.required<string>();
}
