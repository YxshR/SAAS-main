// Mock browser APIs for testing
Object.defineProperty(global, 'CSS', {
  value: {
    supports: jest.fn().mockReturnValue(true)
  }
});

Object.defineProperty(global.navigator, 'deviceMemory', {
  value: 8,
  writable: true
});

Object.defineProperty(global.navigator, 'hardwareConcurrency', {
  value: 8,
  writable: true
});

// Mock canvas context
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  getParameter: jest.fn().mockReturnValue('WebGL 2.0')
});

import { 
  performanceMonitor, 
  priorityManager, 
  GPUAccelerationManager 
} from '../animation-performance';

describe('Animation Performance System', () => {
  beforeEach(() => {
    // Reset state before each test
    performanceMonitor.stopMonitoring();
  });

  afterEach(() => {
    performanceMonitor.stopMonitoring();
  });

  describe('Performance Monitor', () => {
    it('should start and stop monitoring', () => {
      expect(() => {
        performanceMonitor.startMonitoring();
        performanceMonitor.stopMonitoring();
      }).not.toThrow();
    });

    it('should provide performance metrics', () => {
      const metrics = performanceMonitor.getMetrics();
      
      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('frameTime');
      expect(metrics).toHaveProperty('droppedFrames');
      expect(metrics).toHaveProperty('totalFrames');
      expect(metrics).toHaveProperty('averageFps');
      expect(metrics).toHaveProperty('isPerformant');
      
      expect(typeof metrics.fps).toBe('number');
      expect(typeof metrics.isPerformant).toBe('boolean');
    });

    it('should allow subscribing to metrics updates', () => {
      const callback = jest.fn();
      const unsubscribe = performanceMonitor.subscribe(callback);
      
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });

  describe('Priority Manager', () => {
    it('should register and unregister animations', () => {
      const animation = {
        id: 'test-animation',
        priority: 'medium' as const
      };

      expect(() => {
        priorityManager.registerAnimation(animation);
        priorityManager.unregisterAnimation(animation.id);
      }).not.toThrow();
    });

    it('should handle animation requests', () => {
      const animation = {
        id: 'test-animation',
        priority: 'high' as const
      };

      priorityManager.registerAnimation(animation);
      const granted = priorityManager.requestAnimation(animation.id);
      
      expect(typeof granted).toBe('boolean');
      
      priorityManager.releaseAnimation(animation.id);
      priorityManager.unregisterAnimation(animation.id);
    });

    it('should track active animations count', () => {
      const count = priorityManager.getActiveAnimationsCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GPU Acceleration Manager', () => {
    beforeAll(() => {
      GPUAccelerationManager.init();
    });

    it('should detect GPU acceleration support', () => {
      const shouldUse = GPUAccelerationManager.shouldUseGPUAcceleration();
      expect(typeof shouldUse).toBe('boolean');
    });

    it('should provide optimal animation properties', () => {
      const properties = GPUAccelerationManager.getOptimalAnimationProperties();
      expect(Array.isArray(properties)).toBe(true);
      expect(properties.length).toBeGreaterThan(0);
    });

    it('should optimize DOM elements', () => {
      const element = document.createElement('div');
      
      expect(() => {
        GPUAccelerationManager.optimizeElement(element, 'transform');
        GPUAccelerationManager.cleanupElement(element);
      }).not.toThrow();
    });
  });
});