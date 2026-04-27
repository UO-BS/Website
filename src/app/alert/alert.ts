import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  template: `
    @if (alertTitle() || alertText()) {
      <div class="alertBody">
        <header class="alertTitle"> {{ alertTitle() }} </header>
        <p class="alertText"> {{ alertText() }} </p>
      </div>
  }
  `,
  styleUrls: ['./alert.css'],
})
export class Alert {
  alertTitle = input<string>("");
  alertText = input<string>("");
}
