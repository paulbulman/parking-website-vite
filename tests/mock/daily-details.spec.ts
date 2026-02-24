import { test, expect } from '@playwright/test';
import { mockDailyDetailsApi } from '../mocks/handlers';

test.describe('Daily details page', () => {
  test('shows date picker with URL date selected', async ({ page }) => {
    await mockDailyDetailsApi(page);
    await page.goto('/daily-details/2025-03-03');

    await expect(page.locator('#date-picker')).toHaveValue('2025-03-03');
  });

  test('shows allocated users for selected date', async ({ page }) => {
    await mockDailyDetailsApi(page);
    await page.goto('/daily-details/2025-03-03');

    await expect(page.getByText('Alice Smith')).toBeVisible();
  });
});
