import { Component} from '@angular/core';
import { InteractiveAnimation } from '../interactive-animation';

@Component({
  selector: 'app-bubble-animation',
  imports: [],
  template: `
    <canvas #renderer></canvas>
  `,
  styleUrls: ['./bubble-animation.css'],
})

export class BubbleAnimation extends InteractiveAnimation {

  private bubbles: Bubble[] = [];
  private bubbleCount: number = 30;

  initAnimation() {
    // No setup needed for this animation
  }

  renderFrame(timescale: number) {
    // Add new bubbles randomly up to the bubble count limit
    if (this.bubbles.length < this.bubbleCount && Math.random() < 0.05) {
      this.bubbles.push(new Bubble(this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height));
    }

    // Make bubbles draw
    for (const bubble of this.bubbles) {
      bubble.update(this.localMouseX, this.localMouseY, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height, timescale);
      bubble.draw(this.ctx);
    }
  }

}

class Bubble {
  radius!: number;

  red!: number;
  green!: number;
  blue!: number;
  alpha!: number;

  x!: number;
  y!: number;
  vx!: number;
  vy!: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.reset(canvasWidth, canvasHeight);
  }

  update(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number, timescale: number = 1) {
    // Constant forces: bubbles rising
    this.y -= 0.5 * timescale;

    /*
    // Fade in and out based on vertical position (more transparent near top and bottom)
    this.alpha = Math.max(Math.min(
      1 - ((this.y + this.radius) / canvasHeight), // Near the bottom, this approaches 0
      ((this.y - this.radius) / canvasHeight) // Near the top, this approaches 0
    ), 0); 
    */

    // Fade in and out based on distance to edge (more transparent near all edges)
    const startFadeIn = this.radius
    const endFadeIn = this.radius * 3;

    const distanceToEdge = Math.min(Math.min(this.y, canvasHeight - this.y), Math.min(this.x, canvasWidth - this.x));
    if (distanceToEdge < startFadeIn) {
      this.alpha = 0;
    } else if (startFadeIn < distanceToEdge && distanceToEdge < endFadeIn) {
      this.alpha = (distanceToEdge - startFadeIn) / (endFadeIn - startFadeIn); // Fade in from 0 to 1 as it moves up
    } else {
      this.alpha = 1;
    }

    // Resistance based on weight/size (reducing the velocity over time to create a more natural movement)
    const resistance = this.radius * 0.005;
    this.vx *= (1 - resistance);
    this.vy *= (1 - resistance);
    
    // Interaction with mouse: pushed away
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius) {
      // Mouse has touched bubble
      const force = (this.radius - distance) / this.radius;
      this.vx -= (dx / distance) * force * 5;
      this.vy -= (dy / distance) * force * 5;
    }

    // Update position based on velocity - use timescale for consistent speed across different frame rates
    this.x += this.vx * timescale;
    this.y += this.vy * timescale;

    // Reset bubble if it goes off screen
    if (this.y + this.radius < 0 || this.x + this.radius < 0 || this.x - this.radius > canvasWidth || this.y - this.radius > canvasHeight) {
      this.reset(canvasWidth, canvasHeight);
    }
  }

  reset(canvasWidth: number, canvasHeight: number) {
    this.radius = 10 + (Math.random() * 10);
    this.y = canvasHeight + this.radius;
    this.x = Math.random() * canvasWidth;
    this.vx = 0;
    this.vy = 0;

    this.red = Math.random() * 255;
    this.green = Math.random() * 255;
    this.blue = Math.random() * 255;
    this.alpha = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0, 
      this.x, this.y, this.radius
    );

    gradient.addColorStop(0, 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + 0 + ')');
    gradient.addColorStop(0.90, 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + this.alpha + ')');
    gradient.addColorStop(1, 'rgba(' + this.red + ',' + this.green + ',' + this.blue + ',' + 0 + ')');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

}