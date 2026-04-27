import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TextService } from '../text-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="projects" routerLinkActive="active-tab">{{text()?.projectsTabText}}</a>
      <a routerLink="contact" routerLinkActive="active-tab">{{text()?.contactTabText}}</a>
      <a routerLink="animations" routerLinkActive="active-tab">{{text()?.animationsTabText}}</a>
    </nav>
    
  `,
  styleUrls: ['./navbar.css'],
})

export class Navbar {
  private textService = inject(TextService);

  text = toSignal(this.textService.getPageContent('navbar') as Observable<NavbarText>, {initialValue: null});
}

interface NavbarText {
  projectsTabText: string;
  contactTabText: string;
  animationsTabText: string;
}