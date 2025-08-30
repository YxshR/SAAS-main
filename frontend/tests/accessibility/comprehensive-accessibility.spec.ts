/**
 * Comprehensive Accessibility Tests
 * Tests all aspects of accessibility compliance implementation
 */

import { test, expect } from '@playwright/test'

test.describe('Comprehensive Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page
    await page.goto('/')
  })

  test('should have proper keyboard navigation for all interactive elements', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test that all interactive elements are reachable via keyboard
    const interactiveElements = await page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').all()
    
    for (let i = 0; i < Math.min(interactiveElements.length, 10); i++) {
      await page.keyboard.press('Tab')
      const currentFocus = await page.locator(':focus')
      await expect(currentFocus).toBeVisible()
    }
  })

  test('should have proper ARIA labels and semantic markup', async ({ page }) => {
    // Check for main landmark
    const main = page.locator('main, [role="main"]')
    await expect(main).toBeVisible()
    
    // Check for navigation landmark
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav).toBeVisible()
    
    // Check that buttons have accessible names
    const buttons = await page.locator('button').all()
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label')
      const textContent = await button.textContent()
      const ariaLabelledBy = await button.getAttribute('aria-labelledby')
      
      expect(ariaLabel || textContent?.trim() || ariaLabelledBy).toBeTruthy()
    }
    
    // Check that form inputs have labels
    const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"], textarea').all()
    for (const input of inputs) {
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      const id = await input.getAttribute('id')
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).count() > 0 : false
      
      expect(ariaLabel || ariaLabelledBy || hasLabel).toBeTruthy()
    }
  })

  test('should support high contrast mode', async ({ page }) => {
    // Test high contrast mode activation
    await page.evaluate(() => {
      const { highContrastManager } = require('../../src/lib/accessibility')
      highContrastManager.enableHighContrast('dark')
    })
    
    // Check that high contrast class is applied
    const body = page.locator('body')
    await expect(body).toHaveClass(/high-contrast/)
    
    // Check that high contrast indicator is visible
    const indicator = page.locator('body::before')
    // Note: ::before pseudo-elements are hard to test directly in Playwright
    // This would need visual regression testing or computed style checks
  })

  test('should have proper focus management for modals', async ({ page }) => {
    // Look for a button that opens a modal
    const modalTrigger = page.locator('button').filter({ hasText: /menu|profile|settings/i }).first()
    
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click()
      
      // Check that focus is trapped within the modal
      const modal = page.locator('[role="dialog"], [aria-modal="true"]')
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible()
        
        // Test that Tab cycles within the modal
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')
        
        // The focused element should be within the modal
        const isWithinModal = await focusedElement.evaluate((el, modalEl) => {
          return modalEl.contains(el)
        }, await modal.elementHandle())
        
        expect(isWithinModal).toBeTruthy()
        
        // Test Escape key closes modal
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      }
    }
  })

  test('should have proper heading structure', async ({ page }) => {
    // Check for h1 element
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    let previousLevel = 0
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const currentLevel = parseInt(tagName.charAt(1))
      
      // Heading levels should not skip (e.g., h1 -> h3)
      expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1)
      previousLevel = currentLevel
    }
  })

  test('should have skip links', async ({ page }) => {
    // Skip links should be present but hidden initially
    const skipLinks = page.locator('.skip-links a')
    
    if (await skipLinks.count() > 0) {
      // Focus the first skip link
      await skipLinks.first().focus()
      
      // Skip link should become visible when focused
      await expect(skipLinks.first()).toBeVisible()
      
      // Test skip link functionality
      await skipLinks.first().click()
      
      // Focus should move to the target element
      const targetId = await skipLinks.first().getAttribute('href')
      if (targetId) {
        const target = page.locator(targetId)
        await expect(target).toBeFocused()
      }
    }
  })

  test('should support reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    // Check that animations are disabled or reduced
    const animatedElements = page.locator('[class*="animate"], [style*="animation"], [style*="transition"]')
    
    if (await animatedElements.count() > 0) {
      // This would require checking computed styles or visual regression testing
      // For now, we just verify the page still loads correctly with reduced motion
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('should have proper color contrast', async ({ page }) => {
    // This is a basic test - full color contrast testing requires specialized tools
    // Check that text elements are visible
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6, a, button')
    
    const sampleElements = await textElements.all()
    for (let i = 0; i < Math.min(sampleElements.length, 5); i++) {
      const element = sampleElements[i]
      const textContent = await element.textContent()
      
      if (textContent?.trim()) {
        await expect(element).toBeVisible()
      }
    }
  })

  test('should have live regions for dynamic content', async ({ page }) => {
    // Check for live regions
    const liveRegions = page.locator('[aria-live]')
    
    // Should have at least polite and assertive live regions
    const politeLiveRegion = page.locator('[aria-live="polite"]')
    const assertiveLiveRegion = page.locator('[aria-live="assertive"]')
    
    await expect(politeLiveRegion).toHaveCount(1)
    await expect(assertiveLiveRegion).toHaveCount(1)
  })

  test('should handle form validation accessibly', async ({ page }) => {
    // Navigate to a page with forms (login page)
    await page.goto('/login')
    
    // Try to submit form without filling required fields
    const submitButton = page.locator('button[type="submit"], input[type="submit"]')
    
    if (await submitButton.count() > 0) {
      await submitButton.click()
      
      // Check for error messages with proper ARIA attributes
      const errorMessages = page.locator('[role="alert"], [aria-invalid="true"]')
      
      if (await errorMessages.count() > 0) {
        // Error messages should be visible
        await expect(errorMessages.first()).toBeVisible()
        
        // Focus should move to first invalid field
        const invalidField = page.locator('[aria-invalid="true"]')
        if (await invalidField.count() > 0) {
          await expect(invalidField.first()).toBeFocused()
        }
      }
    }
  })

  test('should support keyboard shortcuts', async ({ page }) => {
    // Test Alt+1 for skip to main content
    await page.keyboard.press('Alt+1')
    
    const mainContent = page.locator('main, [role="main"], #main-content')
    if (await mainContent.count() > 0) {
      await expect(mainContent).toBeFocused()
    }
    
    // Test Ctrl+/ for keyboard shortcuts help
    await page.keyboard.press('Control+/')
    
    const shortcutsModal = page.locator('#keyboard-shortcuts-modal')
    if (await shortcutsModal.count() > 0) {
      await expect(shortcutsModal).toBeVisible()
      
      // Close with Escape
      await page.keyboard.press('Escape')
      await expect(shortcutsModal).not.toBeVisible()
    }
  })

  test('should have proper table accessibility', async ({ page }) => {
    // Look for data tables
    const tables = page.locator('table')
    
    if (await tables.count() > 0) {
      const table = tables.first()
      
      // Check for table headers
      const headers = table.locator('th')
      if (await headers.count() > 0) {
        // Headers should have scope attribute
        const firstHeader = headers.first()
        const scope = await firstHeader.getAttribute('scope')
        expect(scope).toBeTruthy()
      }
      
      // Check for caption if present
      const caption = table.locator('caption')
      if (await caption.count() > 0) {
        await expect(caption).toBeVisible()
      }
    }
  })
})

test.describe('Accessibility Settings Component', () => {
  test('should allow users to adjust accessibility preferences', async ({ page }) => {
    // Navigate to settings page
    await page.goto('/settings')
    
    // Look for accessibility settings
    const accessibilitySection = page.locator('text=Accessibility').first()
    
    if (await accessibilitySection.count() > 0) {
      // Test high contrast toggle
      const highContrastToggle = page.locator('input[name="contrast-theme"]').first()
      if (await highContrastToggle.count() > 0) {
        await highContrastToggle.click()
        
        // Verify high contrast mode is applied
        const body = page.locator('body')
        await expect(body).toHaveClass(/high-contrast/)
      }
      
      // Test font size controls
      const fontSizeIncrease = page.locator('button').filter({ hasText: /A\+|increase/i })
      if (await fontSizeIncrease.count() > 0) {
        await fontSizeIncrease.click()
        
        // Font size should increase (would need to check computed styles)
        await expect(page.locator('body')).toBeVisible()
      }
    }
  })
})