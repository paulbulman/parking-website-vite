import { test as setup, expect } from '@playwright/test';
import { authFile } from '../playwright.config';

setup('authenticate', async ({ page }) => {
  const username = process.env['ParkingRota:TestUser'];
  const password = process.env['ParkingRota:TestPassword'];

  if (!username || !password) {
    throw new Error(
      'Missing environment variables: ParkingRota:TestUser and ParkingRota:TestPassword must be set'
    );
  }

  await page.goto('/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL('/');

  await page.context().storageState({ path: authFile });
});
