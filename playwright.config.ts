import { defineConfig, devices } from '@playwright/test';
import { MOCK_TEST_MODE, MOCK_TEST_PORT } from './tests/config';

const authFile = 'playwright/.auth/user.json';
const mockBaseURL = `http://localhost:${MOCK_TEST_PORT}`;
const smokeBaseURL = 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mock-chromium',
      testDir: './tests/mock',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: mockBaseURL,
      },
    },
    {
      name: 'smoke-setup',
      testMatch: 'auth.setup.ts',
      use: {
        baseURL: smokeBaseURL,
      },
    },
    {
      name: 'smoke-chromium',
      testDir: './tests/smoke',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: smokeBaseURL,
        storageState: authFile,
      },
      dependencies: ['smoke-setup'],
    },
  ],
  webServer: [
    {
      command: `npx vite --mode ${MOCK_TEST_MODE} --port ${MOCK_TEST_PORT}`,
      url: mockBaseURL,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      url: smokeBaseURL,
      reuseExistingServer: !process.env.CI,
    },
  ],
});

export { authFile };
