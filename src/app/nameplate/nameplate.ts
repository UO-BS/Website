import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GithubService } from '../github';
import { Observable } from 'rxjs';
import { BubbleAnimation } from '../bubble-animation/bubble-animation';
import { TextService } from '../text-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-nameplate',
  imports: [DatePipe, BubbleAnimation, Alert],
  template: `
    <app-alert alertTitle={{text()?.alertTitle}}
                alertText={{text()?.alertText}} />

    <div id="nameplate-container">
      <div> 
        <header id="nameplate">
          Benjamin Sayyeau
        </header>

        <header id="jobtitle">
          {{text()?.jobTitle}}
        </header>

        <header id="update">
          {{text()?.siteUpdateText}}
          <span id="update-date" [class.hidden]="!lastUpdated()"> 
            {{lastUpdated() | date:'yyyy-MM-dd'}}
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
  private textService = inject(TextService);

  text = toSignal(this.textService.getPageContent('nameplate') as Observable<NameplateText>, {initialValue: null});
  lastUpdated = toSignal(this.githubService.getWebsiteDate(), {initialValue: null});
}

interface NameplateText {
  jobTitle: string;
  siteUpdateText: string;

  alertTitle: string;
  alertText: string;
}