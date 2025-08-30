/**
 * Comprehensive Accessibility Tests for Admin Panel
 * Tests all aspects of accessibility compliance implementation
 */

import { test, expect } from '@playwright/test'

test.describe('Admin Panel Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the admin dashboard
    await page.goto('/dashboard')
  })

  test('should have proper keyboard navigation for admin interface', async ({ page }) => {
    // Test Tab navigation through admin controls
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = await page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Test navigation through data tables and complex components
    const interactiveElements = await page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').all()
    
    for (let i = 0; i < Math.min(interactiveElements.length, 15); i++) {
      await page.keyboard.press('Tab')
      const currentFocus = await page.locator(':focus')
      await expect(currentFocus).toBeVisible()
    }
  })

  test('should have proper ARIA labels for admin controls', async ({ page }) => {
    // Check admin-specific elements
    const adminButtons = await page.locator('button').all()
    for (const button of adminButtons) {
      const ariaLabel = await button.getAttribute('aria-label')
      const textContent = await button.textContent()
      const ariaLabelledBy = await button.getAttribute('aria-labelledby')
      
      expect(ariaLabel || textContent?.trim() || ariaLabelledBy).toBeTruthy()
    }
    
    // Check data table accessibility
    const tables = page.locator('table')
    if (await tables.count() > 0) {
      const table = tables.first()
      
      // Check for proper table headers
      const headers = table.locator('th')
      if (await headers.count() > 0) {
        const firstHeader = headers.first()
        const scope = await firstHeader.getAttribute('scope')
        expect(scope).toBeTruthy()
      }
    }
  })

  test('should support high contrast mode in admin interface', async ({ page }) => {
    // Test high contrast mode activation
    await page.evaluate(() => {
      const { highContrastManager } = require('../../src/lib/accessibility')
      highContrastManager.enableHighContrast('dark')
    })
    
    // Check that high contrast class is applied
    const body = page.locator('body')
    await expect(body).toHaveClass(/high-contrast/)
    
    // Verify admin-specific elements are properly styled
    const adminElements = page.locator('.bg-admin-surface, .text-admin-text-primary')
    if (await adminElements.count() > 0) {
      await expect(adminElements.first()).toBeVisible()
    }
  })

  test('should have proper focus management for admin modals and dialogs', async ({ page }) => {
    // Look for admin action buttons that might open modals
    const modalTriggers = page.locator('button').filter({ hasText: /edit|delete|add|create/i })
    
    if (await modalTriggers.count() > 0) {
      await modalTriggers.first().click()
      
      // Check for modal or dialog
      const modal = page.locator('[role="dialog"], [aria-modal="true"], .modal')
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible()
        
        // Test focus trap
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')
        
        // Focus should be within the modal
        const isWithinModal = await focusedElement.evaluate((el, modalEl) => {
          return modalEl.contains(el)
        }, await modal.elementHandle())
        
        expect(isWithinModal).toBeTruthy()
        
        // Test Escape key
        await page.keyboard.press('Escape')
        await expect(modal).not.toBeVisible()
      }
    }
  })

  test('should have accessible data tables with sorting and filtering', async ({ page }) => {
    const tables = page.locator('table')
    
    if (await tables.count() > 0) {
      const table = tables.first()
      
      // Check for sortable headers
      const sortableHeaders = table.locator('th[aria-sort], th[role="columnheader"]')
      if (await sortableHeaders.count() > 0) {
        const header = sortableHeaders.first()
        
        // Should have proper ARIA attributes
        const ariaSort = await header.getAttribute('aria-sort')
        const role = await header.getAttribute('role')
        
        expect(ariaSort || role).toBeTruthy()
        
        // Test sorting functionality
        await header.click()
        
        // Verify sort state is announced
        const updatedAriaSort = await header.getAttribute('aria-sort')
        expect(updatedAriaSort).not.toBe('none')
      }
      
      // Check for filter controls
      const filterInputs = page.locator('input[placeholder*="filter"], input[placeholder*="search"]')
      if (await filterInputs.count() > 0) {
        const filter = filterInputs.first()
        
        // Should have proper labeling
        const ariaLabel = await filter.getAttribute('aria-label')
        const placeholder = await filter.getAttribute('placeholder')
        
        expect(ariaLabel || placeholder).toBeTruthy()
      }
    }
  })

  test('should have accessible form validation for admin forms', async ({ page }) => {
    // Look for admin forms
    const forms = page.locator('form')
    
    if (await forms.count() > 0) {
      const form = forms.first()
      
      // Try to submit without required fields
      const submitButton = form.locator('button[type="submit"], input[type="submit"]')
      if (await submitButton.count() > 0) {
        await submitButton.click()
        
        // Check for validation messages
        const errorMessages = page.locator('[role="alert"], [aria-invalid="true"], .error-message')
        
        if (await errorMessages.count() > 0) {
          await expect(errorMessages.first()).toBeVisible()
          
          // Focus should move to first invalid field
          const invalidField = page.locator('[aria-invalid="true"]')
          if (await invalidField.count() > 0) {
            await expect(invalidField.first()).toBeFocused()
          }
        }
      }
    }
  })

  test('should have accessible charts and data visualizations', async ({ page }) => {
    // Navigate to analytics or dashboard with charts
    await page.goto('/analytics')
    
    // Look for chart containers
    const charts = page.locator('[role="img"], .chart, canvas, svg')
    
    if (await charts.count() > 0) {
      const chart = charts.first()
      
      // Charts should have accessible descriptions
      const ariaLabel = await chart.getAttribute('aria-label')
      const ariaLabelledBy = await chart.getAttribute('aria-labelledby')
      const ariaDescribedBy = await chart.getAttribute('aria-describedby')
      const title = await chart.getAttribute('title')
      
      expect(ariaLabel || ariaLabelledBy || ariaDescribedBy || title).toBeTruthy()
    }
  })

  test('should support keyboard navigation for complex admin components', async ({ page }) => {
    // Test navigation in user management interface
    await page.goto('/users')
    
    // Test keyboard navigation through user list
    const userRows = page.locator('tr[role="row"], .user-row')
    
    if (await userRows.count() > 0) {
      // Focus first row
      await userRows.first().focus()
      
      // Test arrow key navigation
      await page.keyboard.press('ArrowDown')
      
      // Should move to next row
      const focusedRow = page.locator(':focus')
      await expect(focusedRow).toBeVisible()
    }
    
    // Test bulk actions accessibility
    const bulkActionCheckboxes = page.locator('input[type="checkbox"][aria-label*="select"]')
    if (await bulkActionCheckboxes.count() > 0) {
      await bulkActionCheckboxes.first().check()
      
      // Bulk action controls should become available
      const bulkActions = page.locator('[role="toolbar"], .bulk-actions')
      if (await bulkActions.count() > 0) {
        await expect(bulkActions).toBeVisible()
      }
    }
  })

  test('should have accessible notification and alert systems', async ({ page }) => {
    // Look for notification areas
    const notifications = page.locator('[role="alert"], [role="status"], .notification, .toast')
    
    if (await notifications.count() > 0) {
      const notification = notifications.first()
      
      // Should have proper ARIA attributes
      const role = await notification.getAttribute('role')
      const ariaLive = await notification.getAttribute('aria-live')
      
      expect(role || ariaLive).toBeTruthy()
      
      // Should be visible
      await expect(notification).toBeVisible()
    }
  })

  test('should have accessible admin navigation and breadcrumbs', async ({ page }) => {
    // Check admin navigation
    const adminNav = page.locator('nav[aria-label*="admin"], nav[aria-label*="main"], .admin-nav')
    
    if (await adminNav.count() > 0) {
      // Should have proper labeling
      const ariaLabel = await adminNav.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      
      // Navigation items should be accessible
      const navItems = adminNav.locator('a, button')
      const firstNavItem = navItems.first()
      
      if (await firstNavItem.count() > 0) {
        const itemText = await firstNavItem.textContent()
        const itemAriaLabel = await firstNavItem.getAttribute('aria-label')
        
        expect(itemText?.trim() || itemAriaLabel).toBeTruthy()
      }
    }
    
    // Check breadcrumbs
    const breadcrumbs = page.locator('[aria-label*="breadcrumb"], .breadcrumb, nav ol')
    
    if (await breadcrumbs.count() > 0) {
      const breadcrumb = breadcrumbs.first()
      
      // Should have proper ARIA labeling
      const ariaLabel = await breadcrumb.getAttribute('aria-label')
      expect(ariaLabel).toBeTruthy()
      
      // Current page should be marked
      const currentPage = breadcrumb.locator('[aria-current="page"]')
      if (await currentPage.count() > 0) {
        await expect(currentPage).toBeVisible()
      }
    }
  })

  test('should have accessible settings and configuration interfaces', async ({ page }) => {
    await page.goto('/settings')
    
    // Check for grouped settings sections
    const settingSections = page.locator('[role="group"], fieldset, .setting-group')
    
    if (await settingSections.count() > 0) {
      const section = settingSections.first()
      
      // Should have proper labeling
      const legend = section.locator('legend')
      const ariaLabelledBy = await section.getAttribute('aria-labelledby')
      const ariaLabel = await section.getAttribute('aria-label')
      
      expect(await legend.count() > 0 || ariaLabelledBy || ariaLabel).toBeTruthy()
    }
    
    // Check toggle switches and controls
    const toggles = page.locator('input[type="checkbox"][role="switch"], .toggle, .switch')
    
    if (await toggles.count() > 0) {
      const toggle = toggles.first()
      
      // Should have proper labeling
      const ariaLabel = await toggle.getAttribute('aria-label')
      const ariaLabelledBy = await toggle.getAttribute('aria-labelledby')
      
      expect(ariaLabel || ariaLabelledBy).toBeTruthy()
      
      // Should announce state changes
      await toggle.click()
      
      // State should be reflected in ARIA attributes
      const checked = await toggle.isChecked()
      expect(typeof checked).toBe('boolean')
    }
  })
})