import { test, expect } from '@playwright/test';
import { mockUserApi, mockSummaryApi } from '../mocks/handlers';

test.describe('Edit user page', () => {
  test('pre-populates form with user data', async ({ page }) => {
    await mockUserApi(page);
    await page.goto('/users/edit/user-1');

    await expect(page.locator('#firstName')).toHaveValue('Jane');
    await expect(page.locator('#lastName')).toHaveValue('Doe');
    await expect(page.locator('#registrationNumber')).toHaveValue('XY56 ZAB');
    await expect(page.locator('#commuteDistance')).toHaveValue('12.5');
  });

  test('pre-populates form after navigating away and back', async ({ page }) => {
    await mockUserApi(page);
    await mockSummaryApi(page);

    await page.goto('/users/edit/user-1');
    await expect(page.locator('#firstName')).toHaveValue('Jane');

    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();

    await page.goBack();
    await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();

    await expect(page.locator('#firstName')).toHaveValue('Jane');
    await expect(page.locator('#lastName')).toHaveValue('Doe');
    await expect(page.locator('#registrationNumber')).toHaveValue('XY56 ZAB');
    await expect(page.locator('#commuteDistance')).toHaveValue('12.5');
  });
});
