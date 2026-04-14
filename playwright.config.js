import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './src/frontend/tests',
    timeout: 60000,
    retries: 0,
    workers: 1,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        actionTimeout: 15000,
    },
    webServer: {
        command: 'vite',
        port: 5173,
        reuseExistingServer: true,
        timeout: 30000,
    },
});
