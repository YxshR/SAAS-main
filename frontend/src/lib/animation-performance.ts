/**
 * Animation Performance Monitoring and Optimization System
 * Provides frame rate tracking, animation prioritization, and performance debugging
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  totalFrames: number;
  averageFps: number;
  isPerformant: boolean;
}

export interface AnimationPriority {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  element?: HTMLElement;
  callback?: () => void;
}

export interface DeviceCapabilities {
  supportsGPU: boolean;
  supportsWillChange: boolean;
  supportsTransform3d: boolean;
  memoryLimit: number;
  isLowEndDevice: boolean;
}

class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private frameTimeHistory: number[] = [];
  private droppedFrames = 0;
  private isMonitoring = false;
  private animationFrame?: number;
  private observers: ((metrics: PerformanceMetrics) => void)[] = [];
  private readonly maxHistorySize = 60; // Track last 60 frames
  
  constructor() {
    // Only detect capabilities on client side
    if (typeof window !== 'undefined') {
      this.detectDeviceCapabilities();
    }
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    // Return default capabilities during SSR
    if (typeof document === 'undefined') {
      return {
        supportsGPU: false,
        supportsWillChange: false,
        supportsTransform3d: false,
        memoryLimit: 256,
        isLowEndDevice: true
      };
    }
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    return {
      supportsGPU: !!gl,
      supportsWillChange: CSS.supports('will-change', 'transform'),
      supportsTransform3d: CSS.supports('transform', 'translate3d(0,0,0)'),
      memoryLimit: (navigator as any).deviceMemory || 4,
      isLowEndDevice: (navigator as any).deviceMemory < 4 || navigator.hardwareConcurrency < 4
    };
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.frameTimeHistory = [];
    this.droppedFrames = 0;
    
    this.monitorFrame();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private monitorFrame = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastTime;
    
    this.frameCount++;
    this.frameTimeHistory.push(frameTime);
    
    // Keep history size manageable
    if (this.frameTimeHistory.length > this.maxHistorySize) {
      this.frameTimeHistory.shift();
    }
    
    // Calculate FPS
    this.fps = 1000 / frameTime;
    
    // Detect dropped frames (frame time > 16.67ms for 60fps)
    if (frameTime > 16.67) {
      this.droppedFrames++;
    }
    
    // Notify observers every 10 frames
    if (this.frameCount % 10 === 0) {
      this.notifyObservers();
    }
    
    this.lastTime = currentTime;
    this.animationFrame = requestAnimationFrame(this.monitorFrame);
  };

  private notifyObservers(): void {
    const metrics = this.getMetrics();
    this.observers.forEach(observer => observer(metrics));
  }

  getMetrics(): PerformanceMetrics {
    const averageFrameTime = this.frameTimeHistory.reduce((sum, time) => sum + time, 0) / this.frameTimeHistory.length;
    const averageFps = 1000 / averageFrameTime;
    
    return {
      fps: Math.round(this.fps),
      frameTime: Math.round(averageFrameTime * 100) / 100,
      droppedFrames: this.droppedFrames,
      totalFrames: this.frameCount,
      averageFps: Math.round(averageFps),
      isPerformant: averageFps >= 55 && this.droppedFrames / this.frameCount < 0.1
    };
  }

  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }
}

class AnimationPriorityManager {
  private animations = new Map<string, AnimationPriority>();
  private activeAnimations = new Set<string>();
  private maxConcurrentAnimations = 5;
  private performanceMonitor: AnimationPerformanceMonitor;

  constructor(performanceMonitor: AnimationPerformanceMonitor) {
    this.performanceMonitor = performanceMonitor;
    this.adjustLimitsBasedOnDevice();
  }

  private adjustLimitsBasedOnDevice(): void {
    const capabilities = this.detectDeviceCapabilities();
    if (capabilities.isLowEndDevice) {
      this.maxConcurrentAnimations = 3;
    }
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    // Return default capabilities during SSR
    if (typeof document === 'undefined') {
      return {
        supportsGPU: false,
        supportsWillChange: false,
        supportsTransform3d: false,
        memoryLimit: 256,
        isLowEndDevice: true
      };
    }
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    return {
      supportsGPU: !!gl,
      supportsWillChange: CSS.supports('will-change', 'transform'),
      supportsTransform3d: CSS.supports('transform', 'translate3d(0,0,0)'),
      memoryLimit: (navigator as any).deviceMemory || 4,
      isLowEndDevice: (navigator as any).deviceMemory < 4 || navigator.hardwareConcurrency < 4
    };
  }

  registerAnimation(animation: AnimationPriority): void {
    this.animations.set(animation.id, animation);
  }

  unregisterAnimation(id: string): void {
    this.animations.delete(id);
    this.activeAnimations.delete(id);
  }

  requestAnimation(id: string): boolean {
    const animation = this.animations.get(id);
    if (!animation) return false;

    // Check if we can run this animation
    if (this.canRunAnimation(animation)) {
      this.activeAnimations.add(id);
      return true;
    }

    // Try to make room by pausing lower priority animations
    this.makeRoomForAnimation(animation);
    
    if (this.activeAnimations.size < this.maxConcurrentAnimations) {
      this.activeAnimations.add(id);
      return true;
    }

    return false;
  }

  releaseAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  private canRunAnimation(animation: AnimationPriority): boolean {
    if (this.activeAnimations.size < this.maxConcurrentAnimations) {
      return true;
    }

    // Check if current performance allows for more animations
    const metrics = this.performanceMonitor.getMetrics();
    if (!metrics.isPerformant && animation.priority !== 'critical') {
      return false;
    }

    return animation.priority === 'critical';
  }

  private makeRoomForAnimation(newAnimation: AnimationPriority): void {
    if (newAnimation.priority === 'low') return;

    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const newPriority = priorityOrder[newAnimation.priority];

    // Find lower priority animations to pause
    for (const activeId of this.activeAnimations) {
      const activeAnimation = this.animations.get(activeId);
      if (activeAnimation && priorityOrder[activeAnimation.priority] < newPriority) {
        this.pauseAnimation(activeId);
        break;
      }
    }
  }

  private pauseAnimation(id: string): void {
    const animation = this.animations.get(id);
    if (animation?.element) {
      // Pause the animation by setting animation-play-state
      animation.element.style.animationPlayState = 'paused';
    }
    this.activeAnimations.delete(id);
  }

  getActiveAnimationsCount(): number {
    return this.activeAnimations.size;
  }
}

// GPU Acceleration utilities
export class GPUAccelerationManager {
  private static deviceCapabilities: DeviceCapabilities;

  static init(): void {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.deviceCapabilities = this.detectDeviceCapabilities();
    }
  }

  private static detectDeviceCapabilities(): DeviceCapabilities {
    // Return default capabilities during SSR
    if (typeof document === 'undefined') {
      return {
        supportsGPU: false,
        supportsWillChange: false,
        supportsTransform3d: false,
        memoryLimit: 256,
        isLowEndDevice: true
      };
    }
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    return {
      supportsGPU: !!gl,
      supportsWillChange: CSS.supports('will-change', 'transform'),
      supportsTransform3d: CSS.supports('transform', 'translate3d(0,0,0)'),
      memoryLimit: (navigator as any).deviceMemory || 4,
      isLowEndDevice: (navigator as any).deviceMemory < 4 || navigator.hardwareConcurrency < 4
    };
  }

  static optimizeElement(element: HTMLElement, animationType: 'transform' | 'opacity' | 'filter' = 'transform'): void {
    if (!this.deviceCapabilities) this.init();

    // Apply GPU acceleration hints
    if (this.deviceCapabilities.supportsTransform3d) {
      element.style.transform = element.style.transform || 'translate3d(0,0,0)';
    }

    if (this.deviceCapabilities.supportsWillChange) {
      element.style.willChange = animationType;
    }

    // Force layer creation for better performance
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  }

  static cleanupElement(element: HTMLElement): void {
    // Remove optimization hints after animation
    element.style.willChange = 'auto';
    if (element.style.transform === 'translate3d(0,0,0)') {
      element.style.transform = '';
    }
  }

  static getOptimalAnimationProperties(): string[] {
    if (!this.deviceCapabilities) this.init();

    const optimal = ['transform', 'opacity'];
    
    if (this.deviceCapabilities.supportsGPU) {
      optimal.push('filter');
    }

    return optimal;
  }

  static shouldUseGPUAcceleration(): boolean {
    if (!this.deviceCapabilities) this.init();
    return this.deviceCapabilities.supportsGPU && !this.deviceCapabilities.isLowEndDevice;
  }
}

// Singleton instances
export const performanceMonitor = new AnimationPerformanceMonitor();
export const priorityManager = new AnimationPriorityManager(performanceMonitor);

// Initialize GPU acceleration
GPUAccelerationManager.init();