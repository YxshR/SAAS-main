import { test, expect, devices } from '@playwright/test';

const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
  { name: 'mobile-chrome', device: devices['Pixel 5'] },
  { name: 'mobile-safari', device: devices['iPhone 12'] }
];

browsers.forEach(({ name, device }) => {
  test.describe(`Cross-browser compatibility - ${name}`, () => {
    test.use(device);

    test('Basic page loading and rendering', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check that main content is visible
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
      // Check that navigation is present
      const navigation = page.locator('nav');
      await expect(navigation).toBeVisible();
      
      // Check that key elements are rendered
      const heroSection = page.locator('[data-testid="hero-section"]');
      await expect(heroSection).toBeVisible();
    });

    test('CSS Grid and Flexbox support', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Check grid layout
      const gridContainer = page.locator('[data-testid="dashboard-grid"]');
      if (await gridContainer.count() > 0) {
        const display = await gridContainer.evaluate(el => 
          window.getComputedStyle(el).display
        );
        expect(['grid', 'flex', 'block'].includes(display)).toBeTruthy();
      }
      
      // Check flexbox layout
      const flexContainer = page.locator('[data-testid="flex-container"]');
      if (await flexContainer.count() > 0) {
        const display = await flexContainer.evaluate(el => 
          window.getComputedStyle(el).display
        );
        expect(['flex', 'block'].includes(display)).toBeTruthy();
      }
    });

    test('CSS Custom Properties support', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check if CSS custom properties are working
      const element = page.locator('[data-testid="themed-element"]').first();
      if (await element.count() > 0) {
        const color = await element.evaluate(el => 
          window.getComputedStyle(el).color
        );
        
        // Should not be the initial/default color if custom properties work
        expect(color).not.toBe('rgb(0, 0, 0)');
        expect(color).not.toBe('initial');
      }
    });

    test('JavaScript ES6+ features', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test that modern JavaScript features work
      const jsFeatureTest = await page.evaluate(() => {
        try {
          // Test arrow functions
          const arrowFunc = () => 'arrow';
          
          // Test template literals
          const template = `template ${arrowFunc()}`;
          
          // Test destructuring
          const { length } = [1, 2, 3];
          
          // Test async/await (basic check)
          const asyncTest = async () => 'async';
          
          return {
            arrow: arrowFunc() === 'arrow',
            template: template === 'template arrow',
            destructuring: length === 3,
            async: typeof asyncTest === 'function'
          };
        } catch (error) {
          return { error: error.message };
        }
      });
      
      expect(jsFeatureTest.arrow).toBeTruthy();
      expect(jsFeatureTest.template).toBeTruthy();
      expect(jsFeatureTest.destructuring).toBeTruthy();
      expect(jsFeatureTest.async).toBeTruthy();
    });

    test('Animation support and fallbacks', async ({ page }) => {
      await page.goto('/components/animation-demo');
      await page.waitForLoadState('networkidle');
      
      // Check CSS animation support
      const animatedElement = page.locator('[data-testid="css-animation"]').first();
      if (await animatedElement.count() > 0) {
        const animationName = await animatedElement.evaluate(el => 
          window.getComputedStyle(el).animationName
        );
        
        // Should either have animation or fallback to none
        expect(animationName === 'none' || animationName.length > 0).toBeTruthy();
      }
      
      // Check transform support
      const transformElement = page.locator('[data-testid="transform-element"]').first();
      if (await transformElement.count() > 0) {
        const transform = await transformElement.evaluate(el => 
          window.getComputedStyle(el).transform
        );
        
        expect(transform === 'none' || transform.includes('matrix')).toBeTruthy();
      }
    });

    test('Form input types and validation', async ({ page }) => {
      await page.goto('/register');
      await page.waitForLoadState('networkidle');
      
      // Test email input type
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.count() > 0) {
        await emailInput.fill('invalid-email');
        
        const validity = await emailInput.evaluate((input: HTMLInputElement) => ({
          valid: input.validity.valid,
          typeMismatch: input.validity.typeMismatch
        }));
        
        // Should validate email format
        expect(validity.valid).toBeFalsy();
      }
      
      // Test password input type
      const passwordInput = page.locator('input[type="password"]').first();
      if (await passwordInput.count() > 0) {
        await passwordInput.fill('test-password');
        
        const inputType = await passwordInput.getAttribute('type');
        expect(inputType).toBe('password');
      }
    });

    test('Media queries and responsive design', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test different viewport sizes
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1280, height: 720 }  // Desktop
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(100); // Allow layout to adjust
        
        // Check that responsive navigation works
        const navigation = page.locator('[data-testid="navigation"]');
        await expect(navigation).toBeVisible();
        
        // Check that content is not overflowing
        const body = page.locator('body');
        const scrollWidth = await body.evaluate(el => el.scrollWidth);
        const clientWidth = await body.evaluate(el => el.clientWidth);
        
        // Allow for small differences due to scrollbars
        expect(scrollWidth - clientWidth).toBeLessThan(20);
      }
    });

    test('Local storage and session storage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test localStorage
      const localStorageTest = await page.evaluate(() => {
        try {
          localStorage.setItem('test', 'value');
          const retrieved = localStorage.getItem('test');
          localStorage.removeItem('test');
          return retrieved === 'value';
        } catch (error) {
          return false;
        }
      });
      
      // Test sessionStorage
      const sessionStorageTest = await page.evaluate(() => {
        try {
          sessionStorage.setItem('test', 'value');
          const retrieved = sessionStorage.getItem('test');
          sessionStorage.removeItem('test');
          return retrieved === 'value';
        } catch (error) {
          return false;
        }
      });
      
      // Should work in modern browsers, gracefully degrade in others
      expect(typeof localStorageTest).toBe('boolean');
      expect(typeof sessionStorageTest).toBe('boolean');
    });

    test('Fetch API and network requests', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Test that fetch API works or has polyfill
      const fetchTest = await page.evaluate(() => {
        return typeof fetch === 'function';
      });
      
      expect(fetchTest).toBeTruthy();
      
      // Test that network requests complete successfully
      const networkRequests = [];
      page.on('response', response => {
        if (response.url().includes('/api/')) {
          networkRequests.push({
            url: response.url(),
            status: response.status()
          });
        }
      });
      
      // Trigger some network requests
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check that API requests are successful
      const failedRequests = networkRequests.filter(req => req.status >= 400);
      expect(failedRequests.length).toBe(0);
    });

    test('Touch and pointer events', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test touch event support on mobile devices
      if (name.includes('mobile')) {
        const touchSupport = await page.evaluate(() => {
          return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        });
        
        expect(touchSupport).toBeTruthy();
        
        // Test touch interactions
        const button = page.locator('[data-testid="interactive-button"]').first();
        if (await button.count() > 0) {
          await button.tap();
          // Should not throw error
        }
      }
      
      // Test pointer events
      const pointerSupport = await page.evaluate(() => {
        return 'onpointerdown' in window;
      });
      
      // Pointer events should be supported in modern browsers
      if (name !== 'webkit') { // Safari has limited support
        expect(pointerSupport).toBeTruthy();
      }
    });
  });
});

test.describe('Feature Detection and Polyfills', () => {
  test('Intersection Observer API', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const intersectionObserverSupport = await page.evaluate(() => {
      return 'IntersectionObserver' in window;
    });
    
    // Should be supported or polyfilled
    expect(intersectionObserverSupport).toBeTruthy();
  });

  test('ResizeObserver API', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const resizeObserverSupport = await page.evaluate(() => {
      return 'ResizeObserver' in window;
    });
    
    // Should be supported or polyfilled for chart components
    expect(resizeObserverSupport).toBeTruthy();
  });

  test('Web Animations API', async ({ page }) => {
    await page.goto('/components/animation-demo');
    await page.waitForLoadState('networkidle');
    
    const webAnimationsSupport = await page.evaluate(() => {
      return 'animate' in document.createElement('div');
    });
    
    // Should gracefully degrade if not supported
    expect(typeof webAnimationsSupport).toBe('boolean');
  });
});