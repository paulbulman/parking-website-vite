import { test as base, expect } from '@playwright/test';
import { type Role, authenticateAs } from './auth';
import { type MockApiState, createMockApiState, setupMockApi } from './mock-api';

interface MockFixtures {
  mockApi: MockApiState;
  applyMockApi: () => Promise<void>;
  authenticateAs: (role: Role) => Promise<void>;
}

const test = base.extend<MockFixtures>({
  mockApi: async ({ page }, use) => {
    const state = createMockApiState();
    await use(state);
    await page.unrouteAll();
  },

  applyMockApi: async ({ page, mockApi }, use) => {
    const apply = async () => {
      await setupMockApi(page, mockApi);
    };
    await use(apply);
  },

  authenticateAs: async ({ page }, use) => {
    const auth = async (role: Role) => {
      await authenticateAs(page, role);
    };
    await use(auth);
  },
});

export { test, expect, type MockApiState };
