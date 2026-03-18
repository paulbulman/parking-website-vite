import { test, expect } from '../fixtures';
import { createSummaryResponse } from '../factories/summary';

test.describe('Home page', () => {
  test('displays summary heading after data loads', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
  });

  test('has edit requests link', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Edit Requests' })).toBeVisible();
  });

  test('navigates to edit requests page', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');
    await page.getByRole('link', { name: 'Edit Requests' }).click();
    await expect(page).toHaveURL(/\/edit-requests/);
  });

  test('does not show error state on successful load', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');
    await expect(page.getByText('Error loading summary data')).toBeHidden();
  });

  test('renders desktop table with day links', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    const desktopTable = page.locator('table');
    await expect(desktopTable.locator('a').first()).toBeVisible();

    const dayLinks = desktopTable.locator('a');
    const count = await dayLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('day links have accessible names with date and status', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    const desktopTable = page.locator('table');
    const firstLink = desktopTable.locator('a').first();
    await expect(firstLink).toBeVisible();
    const accessibleName = await firstLink.getAttribute('aria-label');
    expect(accessibleName).toBe('Monday 3 Mar, Allocated');
  });

  test('clicking a day link navigates to daily details', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    const desktopTable = page.locator('table');
    const dayLink = desktopTable.locator('a').first();
    await dayLink.click();

    await expect(page).toHaveURL('/daily-details/2025-03-03');
  });

  test('displays all statuses correctly', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    const desktopTable = page.locator('table');
    await expect(desktopTable.locator('a').first()).toBeVisible();

    const labels = await desktopTable.locator('a').evaluateAll((els) =>
      els
        .map((el) => el.getAttribute('aria-label'))
        .filter((label): label is string => label !== null)
    );

    expect(labels).toContain('Monday 3 Mar, Allocated');
    expect(labels).toContain('Tuesday 4 Mar, Pending');
    expect(labels).toContain('Wednesday 5 Mar, Interrupted');
    expect(labels).toContain('Thursday 6 Mar, No status');
    expect(labels).toContain('Friday 7 Mar, Allocated');
  });
});

test.describe('Home page - mobile view', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('shows day list instead of table', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    await expect(page.locator('table')).toBeHidden();

    const nav = page.getByRole('region', { name: 'Weekly summary' });
    const list = nav.getByRole('list');
    await expect(list).toBeVisible();

    const listItems = list.getByRole('listitem');
    await expect(listItems.first()).toBeVisible();
  });

  test('has week navigation buttons', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Previous week' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next week' })).toBeVisible();
  });

  test('previous week button is disabled on first week', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Previous week' })).toBeDisabled();
  });

  test('next week button changes displayed days', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    const nav = page.getByRole('region', { name: 'Weekly summary' });
    const firstLink = nav.getByRole('link').first();
    await expect(firstLink).toHaveAttribute('aria-label', 'Monday 3 Mar, Allocated');

    await page.getByRole('button', { name: 'Next week' }).click();

    await expect(firstLink).toHaveAttribute('aria-label', 'Monday 10 Mar, Allocated');
  });

  test('clicking a day link navigates to daily details', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    const nav = page.getByRole('region', { name: 'Weekly summary' });
    const dayLink = nav.getByRole('link').first();
    await dayLink.click();

    await expect(page).toHaveURL('/daily-details/2025-03-03');
  });

  test('displays all statuses correctly', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/');

    const nav = page.getByRole('region', { name: 'Weekly summary' });
    await expect(nav.getByRole('link').first()).toBeVisible();

    const labels = await nav.getByRole('link').evaluateAll((els) =>
      els
        .map((el) => el.getAttribute('aria-label'))
        .filter((label): label is string => label !== null)
    );

    expect(labels).toContain('Monday 3 Mar, Allocated');
    expect(labels).toContain('Tuesday 4 Mar, Pending');
    expect(labels).toContain('Wednesday 5 Mar, Interrupted');
    expect(labels).toContain('Thursday 6 Mar, No status');
    expect(labels).toContain('Friday 7 Mar, Allocated');
  });
});
