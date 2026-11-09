import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  reporter: [['list'], ['json', { outputFile: 'test-results/accessibility-results.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } } },
  ],
  webServer: {
    command: 'python3 -m http.server 3100 --bind 127.0.0.1 --directory out > /dev/null 2>&1',
    url: 'http://127.0.0.1:3100/',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
