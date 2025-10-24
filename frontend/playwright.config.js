import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Start backend and frontend automatically for E2E
  webServer: [
    {
      command: 'npm start --prefix backend',
      port: 3000,
      timeout: 120_000,
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev --prefix frontend',
      port: 5173,
      timeout: 120_000,
      reuseExistingServer: true,
    },
  ],
});
