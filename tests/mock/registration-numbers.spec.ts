import { test, expect } from '../fixtures';
import { createRegistrationNumbersResponse } from '../factories/registration-numbers';

test.describe('Registration numbers page', () => {
  test('displays heading and search input', async ({ page }) => {
    await page.goto('/registration-numbers');

    await expect(page.getByRole('heading', { name: 'Registration Numbers' })).toBeVisible();
    await expect(page.getByLabel('Search Registration Number')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('search button is disabled when input is empty', async ({ page }) => {
    await page.goto('/registration-numbers');

    await expect(page.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  test('searching shows results table', async ({ page, mockApi, applyMockApi }) => {
    mockApi.registrationNumbers = createRegistrationNumbersResponse();
    await applyMockApi();
    await page.goto('/registration-numbers');

    await page.getByLabel('Search Registration Number').fill('AB');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('AB12 CDE')).toBeVisible();
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('FG34 HIJ')).toBeVisible();
    await expect(page.getByText('John Smith')).toBeVisible();
  });

  test('shows no results message when empty', async ({ page, mockApi, applyMockApi }) => {
    mockApi.registrationNumbers = createRegistrationNumbersResponse({ registrationNumbers: [] });
    await applyMockApi();
    await page.goto('/registration-numbers');

    await page.getByLabel('Search Registration Number').fill('ZZ');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText('No registration numbers found.')).toBeVisible();
  });
});
