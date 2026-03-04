import { test, expect } from '@playwright/test';
import { mockUnauthorizedApi } from '../mocks/handlers';

test.describe('Auth redirect on 401', () => {
  test('redirects to login when API returns 401', async ({ page }) => {
    await mockUnauthorizedApi(page, 'summary');
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });
});
