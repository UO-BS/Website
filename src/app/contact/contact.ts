import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  template: `
    <table>
      <tr>
        <td>
          <p class="largetext">
            Email: 
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

}
