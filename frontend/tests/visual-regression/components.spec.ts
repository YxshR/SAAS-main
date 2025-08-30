import { test, expect } from '@playwright/test';

test.describe('Component Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up consistent viewport and disable animations for consistent screenshots
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  test('Button component variants', async ({ page }) => {
    await page.goto('/components/button-demo');
    await page.waitForLoadState('networkidle');
    
    // Test different button variants
    const buttonContainer = page.locator('[data-testid="button-variants"]');
    await expect(buttonContainer).toHaveScreenshot('button-variants.png');
  });

  test('Input component states', async ({ page }) => {
    await page.goto('/components/input-demo');
    await page.waitForLoadState('networkidle');
    
    const inputContainer = page.locator('[data-testid="input-states"]');
    await expect(inputContainer).toHaveScreenshot('input-states.png');
  });

  test('Card component variations', async ({ page }) => {
    await page.goto('/components/card-demo');
    await page.waitForLoadState('networkidle');
    
    const cardContainer = page.locator('[data-testid="card-variations"]');
    await expect(cardContainer).toHaveScreenshot('card-variations.png');
  });

  test('Navigation component responsive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Desktop navigation
    const desktopNav = page.locator('[data-testid="desktop-navigation"]');
    await expect(desktopNav).toHaveScreenshot('navigation-desktop.png');
    
    // Mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileNav = page.locator('[data-testid="mobile-navigation"]');
    await expect(mobileNav).toHaveScreenshot('navigation-mobile.png');
  });

  test('Dashboard widgets', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const widgetsContainer = page.locator('[data-testid="dashboard-widgets"]');
    await expect(widgetsContainer).toHaveScreenshot('dashboard-widgets.png');
  });

  test('Chart components', async ({ page }) => {
    await page.goto('/data-visualizations');
    await page.waitForLoadState('networkidle');
    
    const chartsContainer = page.locator('[data-testid="charts-container"]');
    await expect(chartsContainer).toHaveScreenshot('chart-components.png');
  });
});

test.describe('Dark Mode Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
    // Enable dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
  });

  test('Components in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const mainContent = page.locator('main');
    await expect(mainContent).toHaveScreenshot('dark-mode-homepage.png');
  });
});