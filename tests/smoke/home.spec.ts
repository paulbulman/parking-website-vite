import { test, expect } from '@playwright/test';

test('loads summary data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Weekly summary' })).toBeVisible();
});
