import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Landing page accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Authentication pages accessibility', async ({ page }) => {
    const authPages = ['/login', '/register', '/verify-phone'];
    
    for (const pagePath of authPages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      
      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('Dashboard accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();
    
    // Continue tabbing through interactive elements
    const interactiveElements = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const currentFocus = await page.locator(':focus').first();
      if (await currentFocus.isVisible()) {
        const tagName = await currentFocus.evaluate(el => el.tagName.toLowerCase());
        const role = await currentFocus.getAttribute('role');
        interactiveElements.push({ tagName, role });
      }
    }
    
    // Verify that interactive elements are focusable
    const focusableElements = interactiveElements.filter(el => 
      ['button', 'a', 'input', 'select', 'textarea'].includes(el.tagName) ||
      ['button', 'link', 'textbox'].includes(el.role || '')
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(async (heading) => {
        const tagName = await heading.evaluate(el => el.tagName);
        return parseInt(tagName.charAt(1));
      })
    );
    
    // Verify heading hierarchy (should start with h1 and not skip levels)
    if (headingLevels.length > 0) {
      expect(headingLevels[0]).toBe(1); // First heading should be h1
      
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1); // Should not skip levels
      }
    }
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      const ariaLabel = await image.getAttribute('aria-label');
      const ariaLabelledBy = await image.getAttribute('aria-labelledby');
      
      // Images should have alt text or appropriate ARIA labels
      expect(alt !== null || ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy();
    }
    
    // Check for form labels
    const inputs = await page.locator('input, select, textarea').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(label > 0 || ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy();
      }
    }
  });

  test('Color contrast compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('[data-testid]') // Focus on our components
      .analyze();
    
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toEqual([]);
  });

  test('Focus management in modals', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Open a modal
    await page.click('[data-testid="open-modal-button"]');
    await page.waitForSelector('[data-testid="modal"]', { state: 'visible' });
    
    // Check that focus is trapped in modal
    const modalElement = page.locator('[data-testid="modal"]');
    await expect(modalElement).toBeVisible();
    
    // Focus should be on the first focusable element in modal
    const firstFocusableInModal = modalElement.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
    await expect(firstFocusableInModal).toBeFocused();
    
    // Test escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modalElement).not.toBeVisible();
  });

  test('Reduced motion preferences', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that animations respect reduced motion
    const animatedElements = await page.locator('[data-testid*="animated"]').all();
    
    for (const element of animatedElements) {
      const animationDuration = await element.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.animationDuration;
      });
      
      const transitionDuration = await element.evaluate(el => {
        const computedStyle = window.getComputedStyle(el);
        return computedStyle.transitionDuration;
      });
      
      // Animations should be disabled or very short
      expect(
        animationDuration === '0s' || 
        animationDuration === '0.01s' ||
        transitionDuration === '0s' ||
        transitionDuration === '0.01s'
      ).toBeTruthy();
    }
  });

  test('ARIA landmarks and roles', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for main landmark
    const main = await page.locator('main, [role="main"]').count();
    expect(main).toBeGreaterThan(0);
    
    // Check for navigation landmark
    const nav = await page.locator('nav, [role="navigation"]').count();
    expect(nav).toBeGreaterThan(0);
    
    // Check for proper button roles
    const buttons = await page.locator('button, [role="button"]').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Buttons should have accessible names
      expect(ariaLabel !== null || (textContent && textContent.trim().length > 0)).toBeTruthy();
    }
  });

  test('Form validation accessibility', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Submit form with empty fields to trigger validation
    await page.click('[data-testid="submit-button"]');
    
    // Check for error messages
    const errorMessages = await page.locator('[role="alert"], .error-message, [aria-invalid="true"]').all();
    
    for (const errorMessage of errorMessages) {
      // Error messages should be associated with form fields
      const ariaDescribedBy = await errorMessage.getAttribute('aria-describedby');
      const id = await errorMessage.getAttribute('id');
      
      if (id) {
        const associatedField = await page.locator(`[aria-describedby*="${id}"]`).count();
        expect(associatedField).toBeGreaterThan(0);
      }
    }
  });
});