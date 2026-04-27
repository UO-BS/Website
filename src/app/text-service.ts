import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TextService {

  // TODO: Allow other language files here
  private contentUrl = 'public/en.json';
  // I use Record here so that I can treat the content as a dictionary (where keys are page names)
  private data$?: Observable<Record<string, any>>;

  constructor(private http: HttpClient) {}

  // Get all the text for the whole site
  private getAllContent(): Observable<Record<string, any>> {
    if (!this.data$) {
      this.data$ = this.http.get<Record<string, any>>(this.contentUrl).pipe(
        shareReplay(1) // Only ever make the request once
      );
    }
    return this.data$;
  }

  // Get the text for a specific page (returns any or null)
  getPageContent(key: string): Observable<any> {
    return this.getAllContent().pipe(
      map(content => {
        if (content && key in content) {
          return content[key];
        } else {
          console.error(`Page "${key}" not found in "${this.contentUrl}".`);
          return null;
        }
      })
    );
  }
}