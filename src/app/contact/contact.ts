import { Component, inject } from '@angular/core';
import { TextService } from '../text-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-contact',
  imports: [Alert],
  template: `
    <app-alert alertTitle={{text()?.alertTitle}}
                alertText={{text()?.alertText}} />

    <table>
      <tr>
        <td>
          <p class="largetext">
            {{text()?.emailWord}}
          </p>
        </td>
        <td>
          <p class="largetext">
            bsayy072@uottawa.ca
          </p>
        </td>
      </tr>
    
    <tr>
        <td>
          <p class="largetext">
            Github: 
          </p>
        </td>
        <td>
          <p class="largetext">
            https://github.com/UO-BS
          </p>
        </td>
      </tr>
  
    
    </table>
  `,
  styleUrls: ['./contact.css'],
})

export class Contact {
  private textService = inject(TextService);

  text = toSignal(this.textService.getPageContent('contact') as Observable<ContactText>, {initialValue: null});
}

interface ContactText {
  emailWord: string;
  
  alertTitle: string;
  alertText: string;
}