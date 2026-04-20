import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable, shareReplay, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Mousetracker {
  public mousePos: Observable<{x: number, y: number}>;

  //Note: I handle onclick events in specific components instead of this service since components are overlaid on top of each other.

  constructor(private zone: NgZone) {
    this.mousePos = this.zone.runOutsideAngular(() => 
      fromEvent<MouseEvent>(document, 'mousemove').pipe(
        // throttleTime(16),
        map(event => ({ x: event.clientX, y: event.clientY })),
        shareReplay(1)
    ));
  }
}
