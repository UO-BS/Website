import { Component } from '@angular/core';
import { BubbleAnimation } from '../bubble-animation/bubble-animation';
import { GlobeAnimation } from '../globe-animation/globe-animation';

@Component({
  selector: 'app-animation-page',
  imports: [BubbleAnimation, GlobeAnimation],
  template: `
    <div class="animation-page">

      <div class="disclaimer">
        <h2>Angular Animation Repository</h2>
        <p>
          This page displays the various interactive animations that I have created. 
          <br> I plan to create many interactive html elements for a variety of use cases; some of which may be unused in this portfolio website.
          <br> Such unused animations will be kept on this page for demonstration purposes.
        </p>
      </div>

      <div class="banner">

        <div class="banner-content">
          @if (activeAnimation !== 'bubble') {
            <img src="public/BubbleAnimationPreview.png" alt="Bubble Animation Preview" class="preview-image">
          } @else {
            <app-bubble-animation/>
          }
        </div>

        <div class="banner-text">
          <h1>Rising Bubble Animation</h1>
          <p>- Randomly generated bubbles rise to the surface and can be pushed around by the user's cursor </p>
          <p>- Can be used to fill space </p>

          <button (click)="activateAnimation('bubble')" class="activate-button"> Run Animation </button>
        </div>

      </div>


      <div class="banner">

        <div class="banner-content">
          @if (activeAnimation !== 'globe') {
            <img src="public/GlobeAnimationPreview.png" alt="Globe Animation Preview" class="preview-image">
          } @else {
            <app-globe-animation/>
          }
        </div>

        <div class="banner-text">
          <h1>Rotating Sphere Animation</h1>
          <p>- A sphere of clickable points continuously rotate</p>
          <p>- Can be used to interact with a 3D object </p>
          <p>  * A globe with selectable countries...  </p>
          <p>  * A brain with selectable sections...  </p>

          <button (click)="activateAnimation('globe')" class="activate-button"> Run Animation </button>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./animation-page.css'],
})
export class AnimationPage {

  activeAnimation: string | null = null;

  activateAnimation(name: string) {
    this.activeAnimation = name;
  }
}
