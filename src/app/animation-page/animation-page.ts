import { Component } from '@angular/core';

@Component({
  selector: 'app-animation-page',
  imports: [],
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
          <img src="public/BubbleAnimationPreview.png" alt="Bubble Animation Preview" class="preview-image">
        </div>

        <div class="banner-text">
          <h1>Rising Bubble Animation</h1>
          <p> - Randomly generated bubbles rise to the surface and can be pushed around by the user's cursor </p>
          <p> - Can be used to fill space and create visual interest </p>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./animation-page.css'],
})
export class AnimationPage {

}
