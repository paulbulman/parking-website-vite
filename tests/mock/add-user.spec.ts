import { test, expect } from '../fixtures';
import { createMultipleUsersResponse } from '../factories/users';

test.describe('Add user page', () => {
  test('displays heading and form fields', async ({ page }) => {
    await page.goto('/users/add');

    await expect(page.getByRole('heading', { name: 'Add User' })).toBeVisible();
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm email')).toBeVisible();
    await expect(page.getByLabel('First name')).toBeVisible();
    await expect(page.getByLabel('Last name')).toBeVisible();
  });

  test('email mismatch shows error', async ({ page }) => {
    await page.goto('/users/add');

    await page.getByLabel('Email', { exact: true }).fill('user@example.com');
    await page.getByLabel('Confirm email').fill('different@example.com');
    await page.getByLabel('First name').fill('Jane');
    await page.getByLabel('Last name').fill('Doe');

    await page.getByRole('button', { name: 'Add User' }).click();

    await expect(page.getByText('Email addresses do not match')).toBeVisible();
  });

  test('successful submit navigates to users page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users/add');

    await page.getByLabel('Email', { exact: true }).fill('user@example.com');
    await page.getByLabel('Confirm email').fill('user@example.com');
    await page.getByLabel('First name').fill('Jane');
    await page.getByLabel('Last name').fill('Doe');

    await page.getByRole('button', { name: 'Add User' }).click();

    await expect(page).toHaveURL('/users');
  });

  test('cancel navigates to users page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users/add');

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL('/users');
  });
});
