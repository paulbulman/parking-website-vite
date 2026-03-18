import { test, expect } from '../fixtures';
import { createSummaryResponse } from '../factories/summary';
import { createMultipleUsersResponse } from '../factories/users';
import { createReservationsResponse } from '../factories/reservations';
import { createUsersListResponse } from '../factories/users';

test.describe('Permission-based navigation', () => {
  test('non-admin is redirected from /users to access denied', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('none');
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/users');

    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  });

  test('non-admin is redirected from /users/add to access denied', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('teamLeader');
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/users/add');

    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  });

  test('non-team-leader is redirected from /edit-reservations to access denied', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('userAdmin');
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  });

  test('non-team-leader is redirected from /override-requests to access denied', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('userAdmin');
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/override-requests');

    await expect(page.getByRole('heading', { name: 'Access Denied' })).toBeVisible();
  });

  test('user admin can access /users', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('userAdmin');
    mockApi.users = createMultipleUsersResponse();
    await applyMockApi();
    await page.goto('/users');

    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  });

  test('team leader can access /edit-reservations', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('teamLeader');
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    await expect(page.getByRole('heading', { name: 'Edit Reservations' })).toBeVisible();
  });

  test('team leader can access /override-requests', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('teamLeader');
    mockApi.usersList = createUsersListResponse();
    await applyMockApi();
    await page.goto('/override-requests');

    await expect(page.getByRole('heading', { name: 'Override Requests' })).toBeVisible();
  });

  test('access denied page has return to home button', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('none');
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/users');

    await page.getByRole('button', { name: 'Return to Home' }).click();

    await expect(page).toHaveURL('/');
  });
});

test.describe('404 page', () => {
  test('unknown route shows 404 page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/some-nonexistent-page');

    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  });

  test('return to home from 404 page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/some-nonexistent-page');

    await page.getByRole('button', { name: 'Return to Home' }).click();

    await expect(page).toHaveURL('/');
  });
});
