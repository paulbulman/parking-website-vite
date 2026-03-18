import { test, expect } from '../fixtures';
import type { Page } from '@playwright/test';

async function mockUnauthorizedApi(page: Page, endpoint: string) {
  await page.route(`**/${endpoint}`, (route) =>
    route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized' }),
    }),
  );
}

test.describe('Auth redirect on 401', () => {
  test('redirects to login when API returns 401', async ({ page }) => {
    await mockUnauthorizedApi(page, 'summary');
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });
});
