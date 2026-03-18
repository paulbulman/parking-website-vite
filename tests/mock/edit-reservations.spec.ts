import { test, expect } from '../fixtures';
import { createReservationsResponse } from '../factories/reservations';

test.describe('Edit reservations page', () => {
  test('displays heading', async ({ page, mockApi, applyMockApi }) => {
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    await expect(page.getByRole('heading', { name: 'Edit Reservations' })).toBeVisible();
  });

  test('displays dropdowns with accessible labels', async ({ page, mockApi, applyMockApi }) => {
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    const table = page.locator('table');
    await expect(table.getByLabel('Reservation slot 1 for Mon 3 Mar')).toBeVisible();
    await expect(table.getByLabel('Reservation slot 2 for Mon 3 Mar')).toBeVisible();
  });

  test('dropdowns reflect initial reservation state', async ({ page, mockApi, applyMockApi }) => {
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    const table = page.locator('table');
    await expect(table.getByLabel('Reservation slot 1 for Mon 3 Mar')).toHaveValue('user-1');
    await expect(table.getByLabel('Reservation slot 2 for Mon 3 Mar')).toHaveValue('');
  });

  test('dropdowns contain all users plus None option', async ({ page, mockApi, applyMockApi }) => {
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    const table = page.locator('table');
    const dropdown = table.getByLabel('Reservation slot 1 for Mon 3 Mar');

    await expect(dropdown.getByRole('option', { name: 'None' })).toBeAttached();
    await expect(dropdown.getByRole('option', { name: 'Alice Smith' })).toBeAttached();
    await expect(dropdown.getByRole('option', { name: 'Bob Jones' })).toBeAttached();
  });

  test('changing a selection updates the dropdown', async ({ page, mockApi, applyMockApi }) => {
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    const table = page.locator('table');
    const dropdown = table.getByLabel('Reservation slot 2 for Mon 3 Mar');
    await dropdown.selectOption('user-2');
    await expect(dropdown).toHaveValue('user-2');
  });

  test('save shows success message', async ({ page, mockApi, applyMockApi }) => {
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    const table = page.locator('table');
    await table.getByLabel('Reservation slot 2 for Mon 3 Mar').selectOption('user-2');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Reservations saved successfully!')).toBeVisible();
  });

  test('save without changes still succeeds', async ({ page, mockApi, applyMockApi }) => {
    mockApi.reservations = createReservationsResponse();
    await applyMockApi();
    await page.goto('/edit-reservations');

    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('Reservations saved successfully!')).toBeVisible();
  });
});
