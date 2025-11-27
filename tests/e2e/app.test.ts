// ABOUTME: End-to-end tests for the delta-prompts application.
// ABOUTME: Tests page load, diff display, dropdown selection, and URL handling.

import { test, expect } from '@playwright/test';

test.describe('delta-prompts app', () => {
  test('page loads with correct title and tagline', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('h1')).toHaveText('delta-prompts');
    await expect(page.locator('.tagline')).toHaveText(
      'Track how LLM system prompts evolve'
    );
  });

  test('displays version dropdowns', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('#left-version')).toBeVisible();
    await expect(page.locator('#right-version')).toBeVisible();
  });

  test('displays diff viewer panels', async ({ page }) => {
    await page.goto('');
    await expect(page.locator('.diff-panel-left')).toBeVisible();
    await expect(page.locator('.diff-panel-right')).toBeVisible();
  });

  test('shows diff content', async ({ page }) => {
    await page.goto('');
    const diffContent = page.locator('.diff-content').first();
    await expect(diffContent).toContainText('Claude');
  });

  test('URL params select specific versions', async ({ page }) => {
    await page.goto('?left=claude-haiku-3-20240712&right=claude-haiku-3.5-20241022');

    const leftSelect = page.locator('#left-version');
    const rightSelect = page.locator('#right-version');

    await expect(leftSelect).toHaveValue('claude-haiku-3-20240712');
    await expect(rightSelect).toHaveValue('claude-haiku-3.5-20241022');
  });

  test('changing dropdown updates URL', async ({ page }) => {
    await page.goto('');

    const leftSelect = page.locator('#left-version');
    await leftSelect.selectOption('claude-haiku-3-20240712');

    await page.waitForURL(/left=claude-haiku-3-20240712/);
    expect(page.url()).toContain('left=claude-haiku-3-20240712');
  });

  test('shows diff highlights when content differs', async ({ page }) => {
    await page.goto('?left=claude-haiku-3-20240712&right=claude-haiku-3.5-20241022');

    const removedSpan = page.locator('.diff-removed').first();
    const addedSpan = page.locator('.diff-added').first();

    await expect(removedSpan).toBeVisible();
    await expect(addedSpan).toBeVisible();
  });
});
