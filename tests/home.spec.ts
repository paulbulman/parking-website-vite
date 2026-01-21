import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('displays summary heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
  });

  test('has edit requests button', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('button', { name: 'Edit Requests' })
    ).toBeVisible();
  });

  test('navigates to edit requests page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Edit Requests' }).click();
    await expect(page).toHaveURL('/edit-requests');
  });
});
