import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  performanceMonitor, 
  priorityManager, 
  GPUAccelerationManager,
  type PerformanceMetrics,
  type AnimationPriority 
} from '@/lib/animation-performance';

/**
 * Hook for monitoring animation performance
 */
export function useAnimationPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    droppedFrames: 0,
    totalFrames: 0,
    averageFps: 60,
    isPerformant: true
  });

  useEffect(() => {
    performanceMonitor.startMonitoring();
    
    const unsubscribe = performanceMonitor.subscribe(setMetrics);
    
    return () => {
      unsubscribe();
      performanceMonitor.stopMonitoring();
    };
  }, []);

  return metrics;
}

/**
 * Hook for managing animation priorities
 */
export function useAnimationPriority(
  id: string,
  priority: AnimationPriority['priority'] = 'medium'
) {
  const elementRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (elementRef.current) {
      priorityManager.registerAnimation({
        id,
        priority,
        element: elementRef.current
      });
    }

    return () => {
      priorityManager.unregisterAnimation(id);
    };
  }, [id, priority]);

  const requestAnimation = useCallback(() => {
    const granted = priorityManager.requestAnimation(id);
    setIsActive(granted);
    return granted;
  }, [id]);

  const releaseAnimation = useCallback(() => {
    priorityManager.releaseAnimation(id);
    setIsActive(false);
  }, [id]);

  return {
    elementRef,
    isActive,
    requestAnimation,
    releaseAnimation
  };
}

/**
 * Hook for GPU-accelerated animations
 */
export function useGPUAcceleration(
  animationType: 'transform' | 'opacity' | 'filter' = 'transform'
) {
  const elementRef = useRef<HTMLElement>(null);

  const optimize = useCallback(() => {
    if (elementRef.current) {
      GPUAccelerationManager.optimizeElement(elementRef.current, animationType);
    }
  }, [animationType]);

  const cleanup = useCallback(() => {
    if (elementRef.current) {
      GPUAccelerationManager.cleanupElement(elementRef.current);
    }
  }, []);

  useEffect(() => {
    return cleanup; // Cleanup on unmount
  }, [cleanup]);

  return {
    elementRef,
    optimize,
    cleanup,
    shouldUseGPU: GPUAccelerationManager.shouldUseGPUAcceleration(),
    optimalProperties: GPUAccelerationManager.getOptimalAnimationProperties()
  };
}

/**
 * Hook for performance-aware animations
 */
export function usePerformantAnimation(
  animationId: string,
  priority: AnimationPriority['priority'] = 'medium',
  animationType: 'transform' | 'opacity' | 'filter' = 'transform'
) {
  const { elementRef: priorityRef, requestAnimation, releaseAnimation } = useAnimationPriority(animationId, priority);
  const { elementRef: gpuRef, optimize, cleanup } = useGPUAcceleration(animationType);
  const metrics = useAnimationPerformance();

  // Combine refs
  const combinedRef = useCallback((element: HTMLElement | null) => {
    if (priorityRef && 'current' in priorityRef) {
      (priorityRef as React.MutableRefObject<HTMLElement | null>).current = element;
    }
    if (gpuRef && 'current' in gpuRef) {
      (gpuRef as React.MutableRefObject<HTMLElement | null>).current = element;
    }
  }, [priorityRef, gpuRef]);

  const startAnimation = useCallback(() => {
    const granted = requestAnimation();
    if (granted) {
      optimize();
    }
    return granted;
  }, [requestAnimation, optimize]);

  const stopAnimation = useCallback(() => {
    releaseAnimation();
    cleanup();
  }, [releaseAnimation, cleanup]);

  return {
    ref: combinedRef,
    startAnimation,
    stopAnimation,
    metrics,
    shouldAnimate: metrics.isPerformant || priority === 'critical'
  };
}