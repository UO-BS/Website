import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { GithubService } from '../github';
import { Observable } from 'rxjs';
import { BubbleAnimation } from '../bubble-animation/bubble-animation';

@Component({
  selector: 'app-nameplate',
  imports: [AsyncPipe, DatePipe, BubbleAnimation],
  template: `

    <div id="nameplate-container">
      <div> 
        <header id="nameplate">
          Benjamin Sayyeau
        </header>

        <header id="jobtitle">
          Software Engineer
        </header>

        <header id="update">
          Last Website Update: 
          <span id="update-date" [class.hidden]="!(lastUpdated | async)"> 
            {{lastUpdated | async | date:'yyyy-MM-dd'}}
          </span>
        </header>
      </div>
      
      <div class="filler">
        <app-bubble-animation/>
      </div>
    
    </div>
  `,
  styleUrls: ['./nameplate.css'],
})

export class Nameplate {
  private githubService = inject(GithubService);

  lastUpdated!: Observable<Date | null>;

  ngOnInit() {
    this.lastUpdated = this.githubService.getWebsiteDate();
  }
}
