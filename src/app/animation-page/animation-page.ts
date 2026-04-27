import { Component, inject } from '@angular/core';
import { BubbleAnimation } from '../bubble-animation/bubble-animation';
import { GlobeAnimation } from '../globe-animation/globe-animation';
import { Observable } from 'rxjs';
import { TextService } from '../text-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Alert } from '../alert/alert';

@Component({
  selector: 'app-animation-page',
  imports: [BubbleAnimation, GlobeAnimation, Alert],
  template: `
    <div class="animation-page">

      <app-alert alertTitle={{text()?.alertTitle}}
                alertText={{text()?.alertText}} />

      @for (animation of text()?.animationData; track animation.animationId) {
        <div class="banner">

          <div class="banner-content">
            @if (activeAnimation !== animation.animationId) {
              <img src="{{animation.previewURL}}" alt="{{animation.name}} Preview" class="preview-image">
            } @else {
              @switch (animation.animationId) {
                @case (0) {
                  <app-bubble-animation/>
                } @case (1) {
                  <app-globe-animation/>
                }
              }
            }
          </div>

          <div class="banner-text">
            <h1>{{animation.name}}</h1>
            <p>{{animation.desc}}</p>

            <button (click)="activateAnimation(animation.animationId)" class="activate-button"> Run Animation </button>
          </div>

        </div>
      }

    </div>
  `,
  styleUrls: ['./animation-page.css'],
})

export class AnimationPage {
  private textService = inject(TextService);
  text = toSignal(this.textService.getPageContent('animations') as Observable<AnimationPageText>, {initialValue: null});

  activeAnimation: number | null = null;

  activateAnimation(animationId: number) {
    this.activeAnimation = animationId;
  }
}

interface AnimationData {
  animationId: number;
  name: string;
  desc: string;
  previewURL: string;
}

interface AnimationPageText {
  alertTitle: string;
  alertText: string;

  animationData: AnimationData[];
}