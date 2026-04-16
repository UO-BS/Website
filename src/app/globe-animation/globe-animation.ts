import { Component} from '@angular/core';
import { InteractiveAnimation } from '../interactive-animation';

@Component({
  selector: 'app-globe-animation',
  imports: [],
  template: `
    <canvas #renderer></canvas>
  `,
  styleUrls: ['./globe-animation.css'],
})

export class GlobeAnimation extends InteractiveAnimation {
 
  initAnimation() {
    // TBD
  }

  renderFrame(timescale: number) {
    // TBD
  }
}
