import { test, expect } from '@playwright/test';
import { mockProfileApi, mockSummaryApi } from '../mocks/handlers';

test.describe('Profile page', () => {
  test('displays profile heading', async ({ page }) => {
    await mockProfileApi(page);
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });

  test('pre-populates form with profile data', async ({ page }) => {
    await mockProfileApi(page);
    await page.goto('/profile');

    await expect(page.locator('#registrationNumber')).toHaveValue('AB12 CDE');
    await expect(page.locator('#alternativeRegistrationNumber')).toHaveValue('FG34 HIJ');
  });

  test('pre-populates form after navigating away and back', async ({ page }) => {
    await mockProfileApi(page);
    await mockSummaryApi(page);

    await page.goto('/profile');
    await expect(page.locator('#registrationNumber')).toHaveValue('AB12 CDE');

    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();

    await page.getByRole('link', { name: 'Test' }).click();
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();

    await expect(page.locator('#registrationNumber')).toHaveValue('AB12 CDE');
    await expect(page.locator('#alternativeRegistrationNumber')).toHaveValue('FG34 HIJ');
  });
});
