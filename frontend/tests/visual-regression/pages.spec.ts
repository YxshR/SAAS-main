import { test, expect } from '@playwright/test';

test.describe('Page Visual Regression Tests', () => {
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
  });

  test('Landing page layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test hero section
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toHaveScreenshot('landing-hero.png');
    
    // Test feature showcase
    const featuresSection = page.locator('[data-testid="features-section"]');
    await expect(featuresSection).toHaveScreenshot('landing-features.png');
    
    // Test pricing section
    const pricingSection = page.locator('[data-testid="pricing-section"]');
    await expect(pricingSection).toHaveScreenshot('landing-pricing.png');
  });

  test('Authentication pages', async ({ page }) => {
    // Login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-page.png');
    
    // Register page
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('register-page.png');
    
    // Phone verification page
    await page.goto('/verify-phone');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('verify-phone-page.png');
  });

  test('Dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dashboard-page.png');
  });

  test('Chat interface', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('chat-page.png');
  });

  test('Profile and settings pages', async ({ page }) => {
    // Profile page
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('profile-page.png');
    
    // Settings page
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('settings-page.png');
  });

  test('Payment and subscription pages', async ({ page }) => {
    // Pricing page
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('pricing-page.png');
    
    // Payment page
    await page.goto('/payment');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('payment-page.png');
    
    // Subscription page
    await page.goto('/subscription');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('subscription-page.png');
  });

  test('Summary page', async ({ page }) => {
    await page.goto('/summary/test-id');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('summary-page.png');
  });
});

test.describe('Responsive Visual Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'large-desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`Landing page on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
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
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`landing-${name}.png`);
    });
  });
});