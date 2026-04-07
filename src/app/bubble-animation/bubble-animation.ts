import { Component, ElementRef, ViewChild, NgZone, Host, HostListener } from '@angular/core';
import { Mousetracker } from '../mousetracker';

@Component({
  selector: 'app-bubble-animation',
  imports: [],
  template: `
    <canvas #renderer></canvas>
  `,
  styleUrls: ['./bubble-animation.css'],
})

export class BubbleAnimation {
  @ViewChild('renderer') canvasRef!: ElementRef;

  private bubbles: Bubble[] = [];

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private lastFrameTime: number = 0;

  private mouseX: number = 0;
  private mouseY: number = 0;

  private resizeObserver!: ResizeObserver;
  private cachedRect!: DOMRect;

  private bubbleCount: number = 30;

  constructor(private mouseTracker: Mousetracker, private zone: NgZone) {}

  ngAfterViewInit() {
    // Get mouse position
    this.mouseTracker.mousePos.subscribe(pos => {
      this.mouseX = pos.x;
      this.mouseY = pos.y;
    });

    // Get canvas context
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;

    // Size the canvas
    this.resize();
    // Automatically resize canvas when DOM element size changes
    this.resizeObserver = new ResizeObserver(() => {
      this.zone.runOutsideAngular(() => this.resize());
    });
    this.resizeObserver.observe(canvas);

    // Get the current time
    this.lastFrameTime = performance.now();
    // Start animation loop
    this.zone.runOutsideAngular((time) => this.animate(time));
  }

  animate(currentFrameTime: number) {
    // Calculate delta time for consistent movement speed; cap at 100ms to prevent large jumps
    const deltaTime = Math.min(currentFrameTime - this.lastFrameTime, 100);
    let safeDeltaTime = deltaTime;
    if (isNaN(safeDeltaTime) || safeDeltaTime <= 0 || safeDeltaTime > 100) {
      safeDeltaTime = 16; // Default to 60 FPS if delta time is invalid
    }

    this.lastFrameTime = currentFrameTime;
    
    const timescale = safeDeltaTime / 16; // Assuming 60 FPS, so 16ms per frame

    // Add new bubbles
    if (this.bubbles.length < this.bubbleCount && Math.random() < 0.05) {
      this.bubbles.push(new Bubble(this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height));
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Localized mouse position
    const localizedMouseX = this.mouseX - this.cachedRect.left;
    const localizedMouseY = this.mouseY - this.cachedRect.top;

    for (const bubble of this.bubbles) {
      bubble.update(localizedMouseX, localizedMouseY, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height, timescale);
      bubble.draw(this.ctx);
    }

    this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
  }

  // Get the current size and position of the canvas for accurate mouse interaction
  @HostListener('window:scroll')
  updateRect() {
    this.cachedRect = this.canvasRef.nativeElement.getBoundingClientRect();
  }

  // Resize canvas to match container size
  resize() {
    // Get the size of the canvas container
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();

    // Set the canvas size to match the container
    this.canvasRef.nativeElement.width = rect.width;
    this.canvasRef.nativeElement.height = rect.height;

    // Update cached rect for mouse interaction
    this.updateRect();
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
    cancelAnimationFrame(this.animationFrameId);
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