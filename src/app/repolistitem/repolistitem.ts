import { Component, input } from '@angular/core';
import { RepoData } from '../repo-data';
import { DatePipe } from '@angular/common';


@Component({
  selector: '[app-repolistitem]',
  imports: [DatePipe],
  template: `
    <td> 
      <header class="nameData"> {{ repoData().name }} </header>
      <p class="descData"> {{ repoData().description }} </p>
    </td>
    <td class="visibilityData"> {{ repoData().visibility }} </td>
    <td class="dateData"> {{ repoData().lastUpdated | date:'yyyy-MM-dd' }} </td>
  `,
  styleUrls: ['./repolistitem.css'],
})

export class Repolistitem {
  repoData = input.required<RepoData>();
}
