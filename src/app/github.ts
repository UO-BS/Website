import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay} from 'rxjs';
import { RepoData } from './repo-data';

@Injectable({ 
  providedIn: 'root' 
})
export class GithubService {
  private http = inject(HttpClient);

  private readonly githubUsername = 'UO-BS';
  private readonly thisRepoName = 'Website';

  private allRepos = this.http.get<any[]>(`https://api.github.com/users/${this.githubUsername}/repos`).pipe(
    shareReplay(1)
  );

  getWebsiteDate(): Observable<Date | null> {
    return this.allRepos.pipe(
      // This pipe/map setup effectively just waits for a response from the http request. (Its not mapping anything)
      map(allrepos => { 
        const repo = allrepos.find(r => r.name === this.thisRepoName);
        return repo ? new Date(repo.pushed_at) : null;
      })
    )
  }

  getAllRepoData(): Observable<RepoData[]> {
    return this.allRepos.pipe(
      // This pipe/map setup effectively just waits for a response from the http request. (Its not mapping anything)
      map(allrepos => { 
        // We want a list object of all the repos once they've been cleaned up
        // So do an actual map operation on each repo's data, and return it as 1 list object
        return allrepos.map(repo => {
          const cleanRepo: RepoData = {
            name: repo.name,
            description: repo.description,
            lastUpdated: new Date(repo.pushed_at),
            mainLanguage: repo.language,
            visibility: repo.visibility,
            url: repo.html_url}

          return cleanRepo;
        })
      })
    )
  }

}