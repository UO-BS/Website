import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="projects" routerLinkActive="active-tab">Public Projects</a>
      <a routerLink="contact" routerLinkActive="active-tab">Contact Details</a>
      <a routerLink="animations" routerLinkActive="active-tab">Animations</a>
    </nav>
    
  `,
  styleUrls: ['./navbar.css'],
})
export class Navbar {

}
