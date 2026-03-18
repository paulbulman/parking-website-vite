import { test, expect } from '../fixtures';
import { createUsersListResponse } from '../factories/users';
import { createRequestsResponse } from '../factories/requests';
import { createSummaryResponse } from '../factories/summary';

test.describe('Override requests page', () => {
  test('displays heading and user dropdown', async ({ page, mockApi, applyMockApi }) => {
    mockApi.usersList = createUsersListResponse();
    await applyMockApi();
    await page.goto('/override-requests');

    await expect(page.getByRole('heading', { name: 'Override Requests' })).toBeVisible();
    await expect(page.getByLabel('Select User')).toBeVisible();
  });

  test('shows prompt text when no user selected', async ({ page, mockApi, applyMockApi }) => {
    mockApi.usersList = createUsersListResponse();
    await applyMockApi();
    await page.goto('/override-requests');

    await expect(page.getByText('Please select a user to update their requests.')).toBeVisible();
  });

  test('selecting a user shows calendar', async ({ page, mockApi, applyMockApi }) => {
    mockApi.usersList = createUsersListResponse();
    mockApi.userRequests = createRequestsResponse();
    await applyMockApi();
    await page.goto('/override-requests');

    await page.getByLabel('Select User').selectOption('user-1');

    await expect(page.getByRole('checkbox', { name: /Request parking for Mon 3 Mar/ })).toBeVisible();
  });

  test('save navigates home', async ({ page, mockApi, applyMockApi }) => {
    mockApi.usersList = createUsersListResponse();
    mockApi.userRequests = createRequestsResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/override-requests');

    await page.getByLabel('Select User').selectOption('user-1');
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL('/');
  });

  test('cancel navigates home', async ({ page, mockApi, applyMockApi }) => {
    mockApi.usersList = createUsersListResponse();
    mockApi.userRequests = createRequestsResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/override-requests');

    await page.getByLabel('Select User').selectOption('user-1');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL('/');
  });
});
