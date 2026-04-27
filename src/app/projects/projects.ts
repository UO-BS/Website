import { Component, inject } from '@angular/core';
import { Repolistitem } from '../repolistitem/repolistitem'
import { GithubService } from '../github';
import { RepoData } from '../repo-data';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Alert } from '../alert/alert';
import { TextService } from '../text-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-projects',
  imports: [Repolistitem, AsyncPipe, Alert],
  template: `
    <app-alert alertTitle={{text()?.alertTitle}}
                alertText={{text()?.alertText}} />

    <table>
      <thead>
        @let currentSort = (sortRule | async);
        <tr>
          <th (click)="changeSortRules('name')" id="tableproject" >
            {{text()?.projectHeader}}
            @if (currentSort?.key === 'name') {
              <span>{{ currentSort?.asc ? '▲' : '▼' }}</span>
            } @else {
              <span> </span>
            }
          </th>
          <th (click)="changeSortRules('visibility')" id="tablevisibility">
            {{text()?.visibilityHeader}}
            @if (currentSort?.key === 'visibility') {
              <span>{{ currentSort?.asc ? '▲' : '▼' }}</span>
            } @else {
              <span> </span>
            }
          </th>
          <th (click)="changeSortRules('lastUpdated')" id="tableupdated">
            {{text()?.lastUpdatedHeader}}
            @if (currentSort?.key === 'lastUpdated') {
              <span>{{ currentSort?.asc ? '▲' : '▼' }}</span>
            } @else {
              <span> </span>
            }
          </th>
        </tr>
      </thead>

      <tbody>
        @for (repoData of sortedRepoDataList | async; track repoData.name) {
          <tr app-repolistitem [repoData]="repoData" (click)=openRepo(repoData.url)></tr>
        } @empty {
          <p>Loading Repositories...</p>
        }
      </tbody>
    </table>
  `,
  styleUrls: ['./projects.css'],
})

export class Projects {
  // Github access
  private githubService = inject(GithubService);
  // Raw repo data
  private repoDataList!: Observable<RepoData[]>; 

  // Text service access
  private textService = inject(TextService);
  text = toSignal(this.textService.getPageContent('projects') as Observable<ProjectsText>, {initialValue: null});

  // Sorting rules
  sortRule = new BehaviorSubject<{key: keyof RepoData, asc: boolean}>({
    key: 'lastUpdated',
    asc: false
  })
  // Sorted repo data
  sortedRepoDataList!: Observable<RepoData[]>; 

  ngOnInit() {
    // We can use subscribe here to convert the observable into a behaviorsubject
    // Or we can leave it as an observable and risk combineLatest calling the getAllRepoData() whenever the sortrule updates
    // Since getAllRepoData() just returns a copy of something already saved, this is not an issue and we can leave it as observable
    this.repoDataList = this.githubService.getAllRepoData();
    
    // Sort the data
    // Note: The combineLatest will automatically re-run this lambda whenever either input changes
    this.sortedRepoDataList = combineLatest([this.repoDataList, this.sortRule]).pipe(
      map(([repos, rules]) => { // Take the set of repos and the current sorting rules...
        return [...repos].sort((a, b) => {
          const valA = a[rules.key];
          const valB = b[rules.key];

          // Sort based on datatype (Date vs String vs etc...)
          let result = 0;
          if (valA instanceof Date && valB instanceof Date) { // Comparing Dates
            result = valA.getTime() - valB.getTime();
          } else { // Comparing Strings
            result = String(valA).localeCompare(String(valB));
          }

          return rules.asc ? result : result*-1;
        })
      })
    )
    
  }

  changeSortRules(newKey: keyof RepoData) {
    // Take the current sorting rule
    const current = this.sortRule.value;
    this.sortRule.next({ // .next() to Trigger an update to the sorting rule
      key: newKey,
      asc: current.key === newKey ? !current.asc : false // If its the same key: flip the order
    }) 
  }
  
  openRepo(url: string) {
    window.open(url, '_blank')
  }
}

interface ProjectsText {
  projectHeader: string;
  visibilityHeader: string;
  lastUpdatedHeader: string;

  alertTitle: string;
  alertText: string;
}