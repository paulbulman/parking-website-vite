import { test, expect } from '../fixtures';
import { createSingleUserResponse, createMultipleUsersResponse } from '../factories/users';

test.describe('Delete user page', () => {
  test('displays user details', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    await applyMockApi();
    await page.goto('/users/delete/user-1');

    await expect(page.getByRole('heading', { name: 'Delete User' })).toBeVisible();
    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('XY56 ZAB')).toBeVisible();
  });

  test('shows warning text', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    await applyMockApi();
    await page.goto('/users/delete/user-1');

    await expect(page.getByText('Are you sure you want to delete the following user?')).toBeVisible();
    await expect(page.getByText('This action cannot be undone.')).toBeVisible();
  });

  test('has delete and cancel buttons', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    await applyMockApi();
    await page.goto('/users/delete/user-1');

    await expect(page.getByRole('button', { name: 'Delete User' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('delete navigates to users page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users/delete/user-1');

    await page.getByRole('button', { name: 'Delete User' }).click();

    await expect(page).toHaveURL('/users');
  });

  test('cancel navigates to users page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.user = createSingleUserResponse();
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users/delete/user-1');

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL('/users');
  });
});
