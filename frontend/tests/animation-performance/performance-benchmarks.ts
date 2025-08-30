export interface PerformanceBenchmark {
  name: string;
  target: number;
  unit: string;
  description: string;
}

export const ANIMATION_BENCHMARKS: PerformanceBenchmark[] = [
  {
    name: 'page_transition_time',
    target: 2000,
    unit: 'ms',
    description: 'Page transitions should complete within 2 seconds'
  },
  {
    name: 'scroll_animation_fps',
    target: 55,
    unit: 'fps',
    description: 'Scroll animations should maintain at least 55 FPS'
  },
  {
    name: 'hover_animation_duration',
    target: 300,
    unit: 'ms',
    description: 'Hover animations should complete within 300ms'
  },
  {
    name: 'chart_animation_time',
    target: 3000,
    unit: 'ms',
    description: 'Chart animations should complete within 3 seconds'
  },
  {
    name: 'memory_usage_percent',
    target: 50,
    unit: '%',
    description: 'Memory usage should stay below 50% of available heap'
  },
  {
    name: 'memory_leak_threshold',
    target: 50,
    unit: '%',
    description: 'Memory increase after animations should be less than 50%'
  }
];

export class PerformanceReporter {
  private results: Map<string, number> = new Map();

  recordMetric(name: string, value: number): void {
    this.results.set(name, value);
  }

  getResult(name: string): number | undefined {
    return this.results.get(name);
  }

  generateReport(): string {
    let report = '\n=== Animation Performance Report ===\n\n';
    
    ANIMATION_BENCHMARKS.forEach(benchmark => {
      const result = this.results.get(benchmark.name);
      if (result !== undefined) {
        const passed = result <= benchmark.target;
        const status = passed ? '✅ PASS' : '❌ FAIL';
        
        report += `${benchmark.name}: ${result}${benchmark.unit} (target: ${benchmark.target}${benchmark.unit}) ${status}\n`;
        report += `  ${benchmark.description}\n\n`;
      }
    });
    
    return report;
  }

  getAllResults(): Record<string, number> {
    return Object.fromEntries(this.results);
  }
}

export function createPerformanceMonitor() {
  return {
    startTiming: () => performance.now(),
    endTiming: (start: number) => performance.now() - start,
    measureFrameRate: (duration: number = 2000): Promise<number> => {
      return new Promise((resolve) => {
        let frameCount = 0;
        const startTime = performance.now();
        
        function countFrames() {
          frameCount++;
          const elapsed = performance.now() - startTime;
          
          if (elapsed < duration) {
            requestAnimationFrame(countFrames);
          } else {
            const fps = (frameCount / elapsed) * 1000;
            resolve(fps);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    },
    getMemoryUsage: () => {
      if ((performance as any).memory) {
        return {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
          limit: (performance as any).memory.jsHeapSizeLimit
        };
      }
      return null;
    }
  };
}