import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Admin Panel Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Admin dashboard accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Data table accessibility', async ({ page }) => {
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    
    // Check table structure
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check for table headers
    const headers = await table.locator('th').all();
    expect(headers.length).toBeGreaterThan(0);
    
    // Check for proper table scope attributes
    for (const header of headers) {
      const scope = await header.getAttribute('scope');
      expect(scope).toBe('col');
    }
    
    // Check for table caption or aria-label
    const caption = await table.locator('caption').count();
    const ariaLabel = await table.getAttribute('aria-label');
    const ariaLabelledBy = await table.getAttribute('aria-labelledby');
    
    expect(caption > 0 || ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy();
    
    // Run accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Chart accessibility', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
    
    // Check for chart accessibility features
    const charts = await page.locator('[data-testid*="chart"]').all();
    
    for (const chart of charts) {
      // Charts should have accessible names and descriptions
      const ariaLabel = await chart.getAttribute('aria-label');
      const ariaLabelledBy = await chart.getAttribute('aria-labelledby');
      const ariaDescribedBy = await chart.getAttribute('aria-describedby');
      
      expect(ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy();
      
      // Charts should have role="img" or appropriate role
      const role = await chart.getAttribute('role');
      expect(['img', 'graphics-document', 'graphics-object'].includes(role || '')).toBeTruthy();
    }
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Form controls accessibility', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    
    // Check toggle switches
    const toggles = await page.locator('[role="switch"]').all();
    for (const toggle of toggles) {
      const ariaChecked = await toggle.getAttribute('aria-checked');
      expect(['true', 'false'].includes(ariaChecked || '')).toBeTruthy();
      
      const ariaLabel = await toggle.getAttribute('aria-label');
      const ariaLabelledBy = await toggle.getAttribute('aria-labelledby');
      expect(ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy();
    }
    
    // Check form inputs
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
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Modal dialog accessibility', async ({ page }) => {
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    
    // Open user profile modal
    await page.click('[data-testid="view-user-button"]');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    const modal = page.locator('[role="dialog"]');
    
    // Check modal properties
    const ariaModal = await modal.getAttribute('aria-modal');
    expect(ariaModal).toBe('true');
    
    const ariaLabel = await modal.getAttribute('aria-label');
    const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
    expect(ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy();
    
    // Check focus management
    const focusedElement = page.locator(':focus');
    const isInsideModal = await focusedElement.evaluate((el, modalEl) => {
      return modalEl.contains(el);
    }, await modal.elementHandle());
    
    expect(isInsideModal).toBeTruthy();
    
    // Test escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Keyboard navigation in complex interfaces', async ({ page }) => {
    await page.goto('/support');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation through ticket list
    await page.keyboard.press('Tab');
    
    let tabCount = 0;
    const maxTabs = 20;
    const focusedElements = [];
    
    while (tabCount < maxTabs) {
      const focusedElement = await page.locator(':focus').first();
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
        const role = await focusedElement.getAttribute('role');
        const ariaLabel = await focusedElement.getAttribute('aria-label');
        
        focusedElements.push({ tagName, role, ariaLabel });
      }
      
      await page.keyboard.press('Tab');
      tabCount++;
    }
    
    // Should have navigated through multiple interactive elements
    expect(focusedElements.length).toBeGreaterThan(5);
    
    // All focused elements should be interactive
    const interactiveElements = focusedElements.filter(el => 
      ['button', 'a', 'input', 'select', 'textarea'].includes(el.tagName) ||
      ['button', 'link', 'textbox', 'listbox', 'option'].includes(el.role || '')
    );
    
    expect(interactiveElements.length).toBe(focusedElements.length);
  });

  test('High contrast mode support', async ({ page }) => {
    // Simulate high contrast mode
    await page.addStyleTag({
      content: `
        @media (prefers-contrast: high) {
          * {
            background-color: black !important;
            color: white !important;
            border-color: white !important;
          }
        }
      `
    });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that content is still visible and accessible
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .analyze();
    
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toEqual([]);
  });
});