import { test, expect } from '@playwright/test';

test.describe('Admin Panel Component Visual Tests', () => {
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

  test('Admin dashboard widgets', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const statsCards = page.locator('[data-testid="stats-cards"]');
    await expect(statsCards).toHaveScreenshot('admin-stats-cards.png');
    
    const interactiveCharts = page.locator('[data-testid="interactive-charts"]');
    await expect(interactiveCharts).toHaveScreenshot('admin-interactive-charts.png');
  });

  test('User management table', async ({ page }) => {
    await page.goto('/users');
    await page.waitForLoadState('networkidle');
    
    const dataTable = page.locator('[data-testid="users-data-table"]');
    await expect(dataTable).toHaveScreenshot('admin-users-table.png');
    
    const bulkActions = page.locator('[data-testid="bulk-actions-bar"]');
    await expect(bulkActions).toHaveScreenshot('admin-bulk-actions.png');
  });

  test('Analytics dashboard', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
    
    const timeSeriesChart = page.locator('[data-testid="time-series-chart"]');
    await expect(timeSeriesChart).toHaveScreenshot('admin-time-series.png');
    
    const comparativeMetrics = page.locator('[data-testid="comparative-metrics"]');
    await expect(comparativeMetrics).toHaveScreenshot('admin-comparative-metrics.png');
  });

  test('Support system interface', async ({ page }) => {
    await page.goto('/support');
    await page.waitForLoadState('networkidle');
    
    const ticketManagement = page.locator('[data-testid="ticket-management"]');
    await expect(ticketManagement).toHaveScreenshot('admin-ticket-management.png');
    
    const messageThread = page.locator('[data-testid="message-thread"]');
    await expect(messageThread).toHaveScreenshot('admin-message-thread.png');
  });

  test('Settings and configuration', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
    
    const groupedSections = page.locator('[data-testid="grouped-sections"]');
    await expect(groupedSections).toHaveScreenshot('admin-settings-sections.png');
    
    const apiKeyManagement = page.locator('[data-testid="api-key-management"]');
    await expect(apiKeyManagement).toHaveScreenshot('admin-api-keys.png');
  });

  test('Data visualization components', async ({ page }) => {
    await page.goto('/data-visualizations');
    await page.waitForLoadState('networkidle');
    
    const draggableWidgets = page.locator('[data-testid="draggable-widgets"]');
    await expect(draggableWidgets).toHaveScreenshot('admin-draggable-widgets.png');
    
    const chartCustomization = page.locator('[data-testid="chart-customization"]');
    await expect(chartCustomization).toHaveScreenshot('admin-chart-customization.png');
  });
});