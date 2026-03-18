import { test, expect } from '../fixtures';
import { createSingleUserResponse, createMultipleUsersResponse } from '../factories/users';
import { createSummaryResponse } from '../factories/summary';

test.describe('Edit user page', () => {
  test('pre-populates form with user data', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    await applyMockApi();
    await page.goto('/users/edit/user-1');

    await expect(page.getByLabel('First name')).toHaveValue('Jane');
    await expect(page.getByLabel('Last name')).toHaveValue('Doe');
    await expect(page.getByLabel('Registration number', { exact: true })).toHaveValue('XY56 ZAB');
    await expect(page.getByLabel('Commute distance (mi)')).toHaveValue('12.5');
  });

  test('submitting form navigates to users page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users/edit/user-1');

    await expect(page.getByLabel('First name')).toHaveValue('Jane');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL('/users');
  });

  test('cancel navigates to users page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users/edit/user-1');

    await expect(page.getByLabel('First name')).toHaveValue('Jane');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL('/users');
  });

  test('pre-populates form after navigating away and back', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();

    await page.goto('/users/edit/user-1');
    await expect(page.getByLabel('First name')).toHaveValue('Jane');

    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();

    await page.goBack();
    await expect(page.getByRole('heading', { name: 'Edit User' })).toBeVisible();

    await expect(page.getByLabel('First name')).toHaveValue('Jane');
    await expect(page.getByLabel('Last name')).toHaveValue('Doe');
    await expect(page.getByLabel('Registration number', { exact: true })).toHaveValue('XY56 ZAB');
    await expect(page.getByLabel('Commute distance (mi)')).toHaveValue('12.5');
  });
});
