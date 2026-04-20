import { Component, ElementRef, ViewChild, NgZone, HostListener } from '@angular/core';
import { Mousetracker } from './mousetracker';
import { Subscription } from 'rxjs';

@Component({ template: '' })
export abstract class InteractiveAnimation {
    // Child classes must have a canvas element with #renderer
    @ViewChild('renderer', {static: true}) canvasRef!: ElementRef;

    // Canvas management
    protected ctx!: CanvasRenderingContext2D;
    private resizeObserver!: ResizeObserver;
    private clickListener!: (event: MouseEvent) => void;
    protected cachedRect!: DOMRect;

    // Animation frame management
    protected animationFrameId: number = 0;
    protected lastFrameTime: number = 0;

    // Mouse tracking
    private mouseTrackerSubscription?: Subscription;
    protected localMouseX: number = 0;
    protected localMouseY: number = 0;

    constructor(private mouseTracker: Mousetracker, private zone: NgZone) {}

    // Set up the animation object
    ngAfterViewInit() {
        // Subscribe to mouse tracking
        this.mouseTrackerSubscription = this.mouseTracker.mousePos.subscribe(rawPos => {
            this.localMouseX = rawPos.x - this.cachedRect.left;
            this.localMouseY = rawPos.y - this.cachedRect.top;
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

        // Add an onclick listener
        this.clickListener = (event: MouseEvent) => {
            this.zone.runOutsideAngular(() => {
            const localX = event.clientX - this.cachedRect.left;
            const localY = event.clientY - this.cachedRect.top;
            this.onClick(localX, localY);
        })};
        canvas.addEventListener('click', this.clickListener);

        // Run the animation initialization hook
        this.initAnimation();

        // Get the current time
        this.lastFrameTime = performance.now();
        // Start animation loop
        this.zone.runOutsideAngular((time) => this.animate(time));
    }

    // Main animation loop
    // TBD: Allow framerate to be set by the animation isntead of assuming 60fps
    animate(currentFrameTime: number) {
        // Calculate delta time for consistent movement speed; cap at 100ms to prevent large jumps
        const deltaTime = Math.min(currentFrameTime - this.lastFrameTime, 100);
        let safeDeltaTime = deltaTime;
        if (isNaN(safeDeltaTime) || safeDeltaTime <= 0 || safeDeltaTime > 100) {
            safeDeltaTime = 16; // Default to 60 FPS if delta time is invalid
        }

        this.lastFrameTime = currentFrameTime;
        
        const timescale = safeDeltaTime / 16; // Assuming 60 FPS, so 16ms per frame

        // Clear canvas
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.renderFrame(timescale);

        this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
    }

    // Set up any animation elements (called once at the beginning of the animation)
    abstract initAnimation(): void;

    // Draw to the canvas and handle any frame-specific logic (called every frame)
    abstract renderFrame(timescale: number): void;

    // Optional Hook for subclasses to update based on canvas size changes
    protected onResize() {}

    // Optional Hook for subclasses to handle click events on the canvas
    protected onClick(localX: number, localY: number) {}

    // Update a local variable with the current size and position of the canvas for accurate mouse tracking
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

        // Call the optional resize hook
        this.onResize();
    }

    // Deconstruct the animation
    ngOnDestroy() {
        this.resizeObserver.disconnect();
        this.canvasRef.nativeElement.removeEventListener('click', this.clickListener);
        this.mouseTrackerSubscription?.unsubscribe();
        cancelAnimationFrame(this.animationFrameId);        
    }

}