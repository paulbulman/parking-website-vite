import { test, expect } from '../fixtures';
import { createProfileResponse } from '../factories/profile';
import { createSummaryResponse } from '../factories/summary';

test.describe('Profile page', () => {
  test('displays profile heading', async ({ page, mockApi, applyMockApi }) => {
    mockApi.profile = createProfileResponse();
    await applyMockApi();
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
  });

  test('pre-populates form with profile data', async ({ page, mockApi, applyMockApi }) => {
    mockApi.profile = createProfileResponse();
    await applyMockApi();
    await page.goto('/profile');

    await expect(page.getByLabel('Registration number', { exact: true })).toHaveValue('AB12 CDE');
    await expect(page.getByLabel('Alternative registration number')).toHaveValue('FG34 HIJ');
  });

  test('shows request reminder checkbox with correct state', async ({ page, mockApi, applyMockApi }) => {
    mockApi.profile = createProfileResponse();
    await applyMockApi();
    await page.goto('/profile');

    await expect(page.getByText('Requests reminder')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Requests reminder' })).toBeChecked();
  });

  test('shows reservation reminder checkbox for team leaders', async ({ page, mockApi, applyMockApi }) => {
    mockApi.profile = createProfileResponse();
    await applyMockApi();
    await page.goto('/profile');

    // Default mock auth has both UserAdmin and TeamLeader
    await expect(page.getByText('Reservations reminder')).toBeVisible();
  });

  test('hides reservation reminder checkbox for non-team-leaders', async ({ page, mockApi, applyMockApi, authenticateAs }) => {
    await authenticateAs('userAdmin');
    mockApi.profile = createProfileResponse();
    await applyMockApi();
    await page.goto('/profile');

    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByText('Reservations reminder')).toBeHidden();
  });

  test('save shows success message', async ({ page, mockApi, applyMockApi }) => {
    mockApi.profile = createProfileResponse();
    await applyMockApi();
    await page.goto('/profile');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Profile saved successfully!')).toBeVisible();
  });

  test('toggling request reminder checkbox changes its state', async ({ page, mockApi, applyMockApi }) => {
    mockApi.profile = createProfileResponse();
    await applyMockApi();
    await page.goto('/profile');

    const checkbox = page.getByRole('checkbox', { name: 'Requests reminder' });
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('pre-populates form after navigating away and back', async ({ page, mockApi, applyMockApi }) => {
    mockApi.profile = createProfileResponse();
    mockApi.summary = createSummaryResponse();
    await applyMockApi();

    await page.goto('/profile');
    await expect(page.getByLabel('Registration number', { exact: true })).toHaveValue('AB12 CDE');

    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();

    await page.getByRole('link', { name: 'Test' }).click();
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();

    await expect(page.getByLabel('Registration number', { exact: true })).toHaveValue('AB12 CDE');
    await expect(page.getByLabel('Alternative registration number')).toHaveValue('FG34 HIJ');
  });
});
