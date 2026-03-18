import { test, expect } from '../fixtures';
import { createSummaryResponse } from '../factories/summary';

test.describe('FAQ page', () => {
  test('displays heading FAQ', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/faq');

    await expect(page.getByRole('heading', { name: 'FAQ' })).toBeVisible();
  });

  test('has internal links to home page and edit requests', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/faq');

    await expect(page.getByRole('link', { name: 'home page' })).toBeVisible();
    await expect(page.getByRole('link', { name: '"Edit requests"' })).toBeVisible();
  });
});

test.describe('Privacy page', () => {
  test('displays heading Privacy Policy', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/privacy');

    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('contains Data Protection Act text', async ({ page, mockApi, applyMockApi }) => {
    mockApi.summary = createSummaryResponse();
    await applyMockApi();
    await page.goto('/privacy');

    await expect(page.getByRole('link', { name: 'Data Protection Act 2018' })).toBeVisible();
  });
});
