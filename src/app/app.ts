import {Component} from '@angular/core';
import {Navbar} from './navbar/navbar';
import {Nameplate} from './nameplate/nameplate';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Navbar, Nameplate, RouterOutlet],
  template: ` 
      <app-nameplate />
      <app-navbar />
      <main>
        <router-outlet></router-outlet>
      </main>
    `,
  styleUrls: ['./app.css'],
})
export class App {
  title = 'Ben S';
}
