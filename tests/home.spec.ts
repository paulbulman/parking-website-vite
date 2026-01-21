import { test, expect } from '@playwright/test';

const waitForDataToLoad = async (page: import('@playwright/test').Page) => {
  await expect(page.getByText('Loading summary data...')).toBeHidden();
};

const dayLinkPattern = /^(Monday|Tuesday|Wednesday|Thursday|Friday) \d+ \w+, (Allocated|Pending|Interrupted|No status)$/;

test.describe('Home page', () => {
  test('displays summary heading after data loads', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
  });

  test('has edit requests link', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);
    await expect(page.getByRole('link', { name: 'Edit Requests' })).toBeVisible();
  });

  test('navigates to edit requests page', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);
    await page.getByRole('link', { name: 'Edit Requests' }).click();
    await expect(page).toHaveURL(/\/edit-requests/);
  });

  test('does not show error state on successful load', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);
    await expect(page.getByText('Error loading summary data')).toBeHidden();
  });

  test('renders navigation region with day links', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    const nav = page.getByRole('navigation', { name: 'Weekly summary' });
    await expect(nav).toBeVisible();

    const dayLinks = nav.getByRole('link').filter({ hasNot: page.getByText('Edit Requests') });
    const count = await dayLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('day links have accessible names with date and status', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    const nav = page.getByRole('navigation', { name: 'Weekly summary' });
    const dayLinks = nav.getByRole('link');

    const firstLink = dayLinks.first();
    const accessibleName = await firstLink.getAttribute('aria-label');
    expect(accessibleName).toMatch(dayLinkPattern);
  });

  test('clicking a day link navigates to daily details', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    const nav = page.getByRole('navigation', { name: 'Weekly summary' });
    const dayLink = nav.getByRole('link').first();
    await dayLink.click();

    await expect(page).toHaveURL(/\/daily-details\/\d{4}-\d{2}-\d{2}/);
  });
});

test.describe('Home page - mobile view', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('shows day list instead of table', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    await expect(page.locator('table')).toBeHidden();

    const nav = page.getByRole('navigation', { name: 'Weekly summary' });
    const list = nav.getByRole('list');
    await expect(list).toBeVisible();

    const listItems = list.getByRole('listitem');
    await expect(listItems.first()).toBeVisible();
  });

  test('has week navigation buttons', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    await expect(page.getByRole('button', { name: 'Previous week' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next week' })).toBeVisible();
  });

  test('previous week button is disabled on first week', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    await expect(page.getByRole('button', { name: 'Previous week' })).toBeDisabled();
  });

  test('next week button changes displayed days', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    const nextButton = page.getByRole('button', { name: 'Next week' });

    if (await nextButton.isEnabled()) {
      const nav = page.getByRole('navigation', { name: 'Weekly summary' });
      const getFirstDayName = async () => {
        const firstLink = nav.getByRole('link').first();
        return await firstLink.getAttribute('aria-label');
      };

      const initialDay = await getFirstDayName();
      await nextButton.click();
      const newDay = await getFirstDayName();

      expect(newDay).not.toEqual(initialDay);
    }
  });

  test('clicking a day link navigates to daily details', async ({ page }) => {
    await page.goto('/');
    await waitForDataToLoad(page);

    const nav = page.getByRole('navigation', { name: 'Weekly summary' });
    const dayLink = nav.getByRole('link').first();
    await dayLink.click();

    await expect(page).toHaveURL(/\/daily-details\/\d{4}-\d{2}-\d{2}/);
  });
});
