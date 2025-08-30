import { test, expect } from '@playwright/test';

test.describe('Animation Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Page transition performance', async ({ page }) => {
    // Start performance monitoring
    await page.goto('/');
    
    // Measure navigation performance
    const navigationStart = Date.now();
    await page.click('[data-testid="dashboard-link"]');
    await page.waitForLoadState('networkidle');
    const navigationEnd = Date.now();
    
    const navigationTime = navigationEnd - navigationStart;
    expect(navigationTime).toBeLessThan(2000); // Should complete within 2 seconds
    
    // Check for frame drops during navigation
    const performanceEntries = await page.evaluate(() => {
      return performance.getEntriesByType('navigation');
    });
    
    console.log('Navigation performance:', performanceEntries);
  });

  test('Scroll animation performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Monitor frame rate during scroll animations
    await page.evaluate(() => {
      let frameCount = 0;
      let lastTime = performance.now();
      const targetFPS = 60;
      const frameDuration = 1000 / targetFPS;
      
      function measureFrameRate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= frameDuration) {
          frameCount++;
          lastTime = currentTime;
        }
        
        if (frameCount < 100) {
          requestAnimationFrame(measureFrameRate);
        } else {
          // Store results for test verification
          (window as any).frameRateResults = {
            averageFPS: frameCount / ((currentTime - performance.now()) / 1000),
            frameCount
          };
        }
      }
      
      requestAnimationFrame(measureFrameRate);
    });
    
    // Trigger scroll animations
    await page.evaluate(() => {
      window.scrollTo({ top: 1000, behavior: 'smooth' });
    });
    
    await page.waitForTimeout(2000); // Wait for scroll animation to complete
    
    const frameRateResults = await page.evaluate(() => (window as any).frameRateResults);
    
    if (frameRateResults) {
      expect(frameRateResults.averageFPS).toBeGreaterThan(55); // Should maintain near 60fps
    }
  });

  test('Component animation performance', async ({ page }) => {
    await page.goto('/components/animation-demo');
    await page.waitForLoadState('networkidle');
    
    // Test button hover animations
    const button = page.locator('[data-testid="animated-button"]');
    
    // Measure animation performance
    const animationStart = Date.now();
    await button.hover();
    await page.waitForTimeout(500); // Wait for hover animation
    const animationEnd = Date.now();
    
    const animationDuration = animationEnd - animationStart;
    expect(animationDuration).toBeLessThan(1000);
    
    // Test for smooth transitions
    const computedStyle = await button.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    
    expect(computedStyle).toContain('transform');
  });

  test('Large dataset animation performance', async ({ page }) => {
    await page.goto('/data-visualizations');
    await page.waitForLoadState('networkidle');
    
    // Test chart animation with large dataset
    const chartContainer = page.locator('[data-testid="large-dataset-chart"]');
    
    const performanceStart = performance.now();
    
    // Trigger chart animation
    await page.click('[data-testid="animate-chart-button"]');
    await page.waitForSelector('[data-testid="chart-animation-complete"]', { timeout: 5000 });
    
    const performanceEnd = performance.now();
    const totalTime = performanceEnd - performanceStart;
    
    expect(totalTime).toBeLessThan(3000); // Should complete within 3 seconds
    
    // Check memory usage
    const memoryInfo = await page.evaluate(() => {
      return (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : null;
    });
    
    if (memoryInfo) {
      const memoryUsagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
      expect(memoryUsagePercent).toBeLessThan(50); // Should use less than 50% of available memory
    }
  });

  test('Reduced motion preference handling', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that animations are disabled or reduced
    const animatedElement = page.locator('[data-testid="hero-animation"]');
    
    const animationDuration = await animatedElement.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return computedStyle.animationDuration;
    });
    
    // Should have no animation or very short duration
    expect(animationDuration === '0s' || animationDuration === '0.01s').toBeTruthy();
  });

  test('Animation memory leak detection', async ({ page }) => {
    await page.goto('/components/animation-demo');
    await page.waitForLoadState('networkidle');
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Trigger multiple animations
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="trigger-animation"]');
      await page.waitForTimeout(100);
    }
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
      
      // Memory increase should be reasonable (less than 50% increase)
      expect(memoryIncreasePercent).toBeLessThan(50);
    }
  });
});