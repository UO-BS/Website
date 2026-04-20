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
 
  private drawSphere?: Sphere;

  initAnimation() {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    const boundingDimension = Math.min(canvas.width, canvas.height);
    this.drawSphere = new Sphere(canvas.width / 2, canvas.height / 2, 0, boundingDimension / 2, 100);
  }

  renderFrame(timescale: number) {
    if (!this.drawSphere) return; 

    this.drawSphere.draw(this.ctx, timescale, this.localMouseX, this.localMouseY);
  }

  protected override onClick(localX: number, localY: number): void {
    if (!this.drawSphere) return; 

    // Move the onClick event to the sphere
    this.drawSphere.onClick(localX, localY);
  }

  protected override onResize(): void {
    // Recenter the globe when the canvas size changes

    if (!this.drawSphere) return; 
    
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement; 
    this.drawSphere.moveSphereTo(canvas.width / 2, canvas.height / 2, 0);
  }
}

class Sphere {
  originX!: number;
  originY!: number;
  originZ!: number;
  radius!: number;
  pointCount!: number;
  rotationX: number = 0;
  rotationY: number = 0;

  points: Point[] = [];

  constructor(originX: number, originY: number, originZ: number, radius: number, pointCount: number) {
    this.originX = originX;
    this.originY = originY;
    this.originZ = originZ;
    this.radius = radius;
    this.pointCount = pointCount;

    // Initialize points
    this.initPoints();
  }

  moveSphereTo(X: number, Y: number, Z: number) {
    this.originX = X;
    this.originY = Y;
    this.originZ = Z;
  }

  // Use the golden spiral to create a set of points that shape a sphere
  initPoints() {
    for (let i = 0; i < this.pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / this.pointCount);
      const theta = Math.sqrt(this.pointCount * Math.PI) * phi;
      
      this.points.push(new Point(
        this.radius * Math.cos(theta) * Math.sin(phi),
        this.radius * Math.sin(theta) * Math.sin(phi),
        this.radius * Math.cos(phi)
      ));
    }
  }

  draw(ctx: CanvasRenderingContext2D, timescale: number, mouseX: number, mouseY: number) {
    // Rotate the sphere slightly for the animation
    this.rotationY += 0.002 * timescale;
    this.rotationX += 0.002 * timescale;
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);

    // Note: It would be possible to draw all the points at once using a single path if they were the same color
    for (const point of this.points) {
      const {x, y, z, radius} = point.getAbsolutePosition(this.originX, this.originY, this.originZ, cosX, sinX, cosY, sinY, this.radius, mouseX, mouseY);
      point.draw(ctx, x, y, z, radius, mouseX, mouseY);
    }
  }

  // Handle onClick
  onClick(clickX: number, clickY: number) {
    // Search all the points in the sphere for the one that was clicked
    for (const point of this.points) {
      const {x, y, z, radius} = point.getAbsolutePosition(this.originX, this.originY, this.originZ, Math.cos(this.rotationX), Math.sin(this.rotationX), Math.cos(this.rotationY), Math.sin(this.rotationY), this.radius, clickX, clickY);
      
      // I could use the z value here to prevent points on the back of the sphere from being clicked...

      const dx = clickX - x;
      const dy = clickY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        point.onClick();
        break; // Point has been found
      }
    }
  }

}

class Point {
  x!: number;
  y!: number;
  z!: number;

  hoverState: 'default' | 'hover' = 'default';
  hoverRadiusMultiplier: number = 2;
  colorState: 'default' | 'hovered' | 'clicked' = 'default';

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  getAbsolutePosition(originX: number, originY: number, originZ: number, cosX: number, sinX: number, cosY: number, sinY: number, sphereRadius: number, mouseX: number, mouseY: number) {
    // Apply rotations (Y rotation followed by X rotation) and translate to origin
    const x1 = this.x * cosY + this.z * sinY + originX;
    const y1 = this.y * cosX - ((-this.x * sinY + this.z * cosY) * sinX) + originY;
    const z1 = this.y * sinX + ((-this.x * sinY + this.z * cosY) * cosX) + originZ;

    // Scale the radius of the point with the z depth value for perspective
    let radius = Math.max(1, (z1/sphereRadius) * 5);

    if (this.hoverState === 'hover') {
      radius *= this.hoverRadiusMultiplier;
    }

    return {x: x1, y: y1, z: z1, radius};
  }

  draw(ctx: CanvasRenderingContext2D, x1: number, y1: number, z1: number, radius: number, mouseX: number, mouseY: number) {
    
    // Mouse Interaction: Change the point's state based on whether the mouse is hovering over it or not
    const dx = mouseX - x1;
    const dy = mouseY - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (this.hoverState === 'hover' && distance > radius) {
      // The mouse has exited the point; exit the hover state
      this.hoverState = 'default';
    } else if (this.hoverState === 'default' && distance < radius) {
      // The mouse has entered the point; enter the hover state
      this.hoverState = 'hover';

      // Change the color of the point when hovered unless it's already been clicked
      if (this.colorState !== 'clicked') {
        this.colorState = 'hovered';
      }
    }

    // Draw the point as a circle
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, Math.PI * 2);

    switch (this.colorState) {
      case 'default':
        ctx.fillStyle = 'rgb(255, 255, 255)';
        break;
      case 'hovered':
        ctx.fillStyle = 'rgb(0, 255, 140)';
        break;
      case 'clicked':
        ctx.fillStyle = 'rgb(255, 0, 0)';
        break;
    }

    ctx.fill();
  }

  onClick() {
    // Toggle the clicked state of the point
    if (this.colorState === 'clicked') {
      this.colorState = 'default';
    } else {
      this.colorState = 'clicked';
    }
  }
}