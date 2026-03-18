import { test, expect } from '../fixtures';
import { createMultipleUsersResponse } from '../factories/users';

test.describe('Users page', () => {
  test('displays heading and add user link', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users');

    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Add User' })).toBeVisible();
  });

  test('displays user data in table', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users');

    const table = page.getByRole('table', { name: 'Users' });
    await expect(table).toBeVisible();

    await expect(table.getByText('Jane')).toBeVisible();
    await expect(table.getByText('Doe')).toBeVisible();
    await expect(table.getByText('John')).toBeVisible();
    await expect(table.getByText('Smith')).toBeVisible();
  });

  test('shows edit and delete links with accessible names', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users');

    await expect(page.getByRole('link', { name: 'Edit Jane Doe' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Delete Jane Doe' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit John Smith' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Delete John Smith' })).toBeVisible();
  });

  test('edit link navigates to edit page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users');

    await page.getByRole('link', { name: 'Edit Jane Doe' }).click();
    await expect(page).toHaveURL('/users/edit/user-1');
  });

  test('delete link navigates to delete page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users');

    await page.getByRole('link', { name: 'Delete Jane Doe' }).click();
    await expect(page).toHaveURL('/users/delete/user-1');
  });

  test('shows placeholder for missing registration number', async ({ page, mockApi, applyMockApi }) => {
    mockApi.users = createMultipleUsersResponse({
      users: [{
        userId: 'user-1',
        firstName: 'Jane',
        lastName: 'Doe',
        registrationNumber: null,
        alternativeRegistrationNumber: null,
        commuteDistance: null,
      }],
    });
    await applyMockApi();
    await page.goto('/users');

    const table = page.getByRole('table', { name: 'Users' });
    const dashes = table.getByText('-');
    const count = await dashes.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
