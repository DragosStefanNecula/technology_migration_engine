import { test as base, _electron as electron } from '@playwright/test';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../..');

/**
 * Worker-scoped fixtures so one Electron instance is shared across all tests
 * in the worker, avoiding repeated launch/close overhead.
 */
export const test = base.extend({
    electronApp: [
        async ({}, use) => {
            const app = await electron.launch({
                args: [join(ROOT, 'src/main.js')],
                env: { ...process.env, NODE_ENV: 'development' },
                cwd: ROOT,
            });
            await use(app);
            await app.close();
        },
        { scope: 'worker' },
    ],

    appPage: [
        async ({ electronApp }, use) => {
            const page = await electronApp.firstWindow();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForSelector('nav.navbar:not(.footer)');
            await use(page);
        },
        { scope: 'worker' },
    ],
});

export { expect } from '@playwright/test';
