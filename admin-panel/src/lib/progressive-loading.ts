'use client';

import { useState, useEffect, useCallback } from 'react';

// Performance monitoring for progressive loading
export class ProgressiveLoadingMonitor {
  private static instance: ProgressiveLoadingMonitor;
  private loadingMetrics: Map<string, LoadingMetric> = new Map();
  private performanceObserver?: PerformanceObserver;

  static getInstance(): ProgressiveLoadingMonitor {
    if (!ProgressiveLoadingMonitor.instance) {
      ProgressiveLoadingMonitor.instance = new ProgressiveLoadingMonitor();
    }
    return ProgressiveLoadingMonitor.instance;
  }

  constructor() {
    this.initializePerformanceObserver();
  }

  private initializePerformanceObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.recordMetric(entry.name, {
              duration: entry.duration,
              startTime: entry.startTime,
              type: 'measure',
            });
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }
  }

  startTiming(id: string, type: LoadingType = 'component') {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${id}-start`);
      this.loadingMetrics.set(id, {
        id,
        type,
        startTime: performance.now(),
        status: 'loading',
      });
    }
  }

  endTiming(id: string, success: boolean = true) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const endTime = performance.now();
      performance.mark(`${id}-end`);
      performance.measure(id, `${id}-start`, `${id}-end`);

      const metric = this.loadingMetrics.get(id);
      if (metric) {
        metric.endTime = endTime;
        metric.duration = endTime - metric.startTime;
        metric.status = success ? 'success' : 'error';
        this.loadingMetrics.set(id, metric);
      }
    }
  }

  private recordMetric(id: string, data: Partial<LoadingMetric>) {
    const existing = this.loadingMetrics.get(id);
    if (existing) {
      this.loadingMetrics.set(id, { ...existing, ...data });
    }
  }

  getMetrics(): LoadingMetric[] {
    return Array.from(this.loadingMetrics.values());
  }

  getAverageLoadTime(type?: LoadingType): number {
    const metrics = this.getMetrics().filter(
      (m) => m.duration && (!type || m.type === type)
    );
    
    if (metrics.length === 0) return 0;
    
    const total = metrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return total / metrics.length;
  }

  clearMetrics() {
    this.loadingMetrics.clear();
  }
}

interface LoadingMetric {
  id: string;
  type: LoadingType;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'loading' | 'success' | 'error';
}

type LoadingType = 'component' | 'image' | 'data' | 'route' | 'measure';

// Progressive loading strategy manager
export class ProgressiveLoadingStrategy {
  private static instance: ProgressiveLoadingStrategy;
  private strategies: Map<string, LoadingStrategy> = new Map();
  private connectionSpeed: ConnectionSpeed = 'fast';

  static getInstance(): ProgressiveLoadingStrategy {
    if (!ProgressiveLoadingStrategy.instance) {
      ProgressiveLoadingStrategy.instance = new ProgressiveLoadingStrategy();
    }
    return ProgressiveLoadingStrategy.instance;
  }

  constructor() {
    this.detectConnectionSpeed();
    this.initializeDefaultStrategies();
  }

  private detectConnectionSpeed() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        switch (effectiveType) {
          case 'slow-2g':
          case '2g':
            this.connectionSpeed = 'slow';
            break;
          case '3g':
            this.connectionSpeed = 'medium';
            break;
          case '4g':
          default:
            this.connectionSpeed = 'fast';
            break;
        }
      }
    }
  }

  private initializeDefaultStrategies() {
    // Component loading strategies
    this.strategies.set('component-slow', {
      threshold: 0.05,
      rootMargin: '20px',
      animationDelay: 200,
      staggerDelay: 100,
      enableSkeleton: true,
      enableBlur: false,
    });

    this.strategies.set('component-medium', {
      threshold: 0.1,
      rootMargin: '50px',
      animationDelay: 150,
      staggerDelay: 75,
      enableSkeleton: true,
      enableBlur: true,
    });

    this.strategies.set('component-fast', {
      threshold: 0.1,
      rootMargin: '100px',
      animationDelay: 100,
      staggerDelay: 50,
      enableSkeleton: true,
      enableBlur: true,
    });

    // Image loading strategies
    this.strategies.set('image-slow', {
      threshold: 0.05,
      rootMargin: '20px',
      animationDelay: 300,
      enableBlur: true,
      quality: 50,
    });

    this.strategies.set('image-medium', {
      threshold: 0.1,
      rootMargin: '50px',
      animationDelay: 200,
      enableBlur: true,
      quality: 75,
    });

    this.strategies.set('image-fast', {
      threshold: 0.1,
      rootMargin: '100px',
      animationDelay: 100,
      enableBlur: true,
      quality: 85,
    });
  }

  getStrategy(type: LoadingType): LoadingStrategy {
    const key = `${type}-${this.connectionSpeed}`;
    return this.strategies.get(key) || this.strategies.get(`${type}-medium`)!;
  }

  updateConnectionSpeed(speed: ConnectionSpeed) {
    this.connectionSpeed = speed;
  }

  setCustomStrategy(key: string, strategy: LoadingStrategy) {
    this.strategies.set(key, strategy);
  }
}

interface LoadingStrategy {
  threshold: number;
  rootMargin: string;
  animationDelay: number;
  staggerDelay?: number;
  enableSkeleton?: boolean;
  enableBlur?: boolean;
  quality?: number;
}

type ConnectionSpeed = 'slow' | 'medium' | 'fast';

// Progressive loading hook
export const useProgressiveLoading = (
  id: string,
  type: LoadingType = 'component'
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const monitor = ProgressiveLoadingMonitor.getInstance();
  const strategy = ProgressiveLoadingStrategy.getInstance().getStrategy(type);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    monitor.startTiming(id, type);
  }, [id, type, monitor]);

  const updateProgress = useCallback((newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  }, []);

  const finishLoading = useCallback((success: boolean = true, errorMessage?: string) => {
    setIsLoading(false);
    setProgress(100);
    monitor.endTiming(id, success);
    
    if (!success && errorMessage) {
      setError(errorMessage);
    }
  }, [id, monitor]);

  const resetLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
  }, []);

  return {
    isLoading,
    error,
    progress,
    strategy,
    startLoading,
    updateProgress,
    finishLoading,
    resetLoading,
  };
};

// Resource preloader
export class ResourcePreloader {
  private static instance: ResourcePreloader;
  private preloadedResources: Set<string> = new Set();
  private preloadQueue: PreloadItem[] = [];
  private isProcessing = false;

  static getInstance(): ResourcePreloader {
    if (!ResourcePreloader.instance) {
      ResourcePreloader.instance = new ResourcePreloader();
    }
    return ResourcePreloader.instance;
  }

  preloadImage(src: string, priority: PreloadPriority = 'medium'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedResources.has(src)) {
        resolve();
        return;
      }

      const item: PreloadItem = {
        type: 'image',
        src,
        priority,
        resolve,
        reject,
      };

      this.addToQueue(item);
    });
  }

  preloadComponent(
    importFn: () => Promise<any>,
    id: string,
    priority: PreloadPriority = 'medium'
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedResources.has(id)) {
        resolve();
        return;
      }

      const item: PreloadItem = {
        type: 'component',
        src: id,
        priority,
        importFn,
        resolve,
        reject,
      };

      this.addToQueue(item);
    });
  }

  private addToQueue(item: PreloadItem) {
    // Insert based on priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const insertIndex = this.preloadQueue.findIndex(
      (queueItem) => priorityOrder[queueItem.priority] > priorityOrder[item.priority]
    );

    if (insertIndex === -1) {
      this.preloadQueue.push(item);
    } else {
      this.preloadQueue.splice(insertIndex, 0, item);
    }

    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.preloadQueue.length === 0) return;

    this.isProcessing = true;

    while (this.preloadQueue.length > 0) {
      const item = this.preloadQueue.shift()!;
      
      try {
        if (item.type === 'image') {
          await this.loadImage(item.src);
        } else if (item.type === 'component' && item.importFn) {
          await item.importFn();
        }

        this.preloadedResources.add(item.src);
        item.resolve();
      } catch (error) {
        item.reject(error);
      }
    }

    this.isProcessing = false;
  }

  private loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  isPreloaded(src: string): boolean {
    return this.preloadedResources.has(src);
  }

  clearCache() {
    this.preloadedResources.clear();
    this.preloadQueue = [];
  }
}

interface PreloadItem {
  type: 'image' | 'component';
  src: string;
  priority: PreloadPriority;
  importFn?: () => Promise<any>;
  resolve: () => void;
  reject: (error: any) => void;
}

type PreloadPriority = 'high' | 'medium' | 'low';

// Export instances for easy access
export const progressiveLoadingMonitor = ProgressiveLoadingMonitor.getInstance();
export const progressiveLoadingStrategy = ProgressiveLoadingStrategy.getInstance();
export const resourcePreloader = ResourcePreloader.getInstance();