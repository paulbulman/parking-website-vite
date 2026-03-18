import { test, expect } from '../fixtures';
import { createSummaryResponse } from '../factories/summary';

test.describe('Login page', () => {
  test('authenticated user is redirected away from login', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/login');

    // In mock mode the user is always authenticated, so they should be redirected
    await expect(page).not.toHaveURL(/\/login/);
  });
});
