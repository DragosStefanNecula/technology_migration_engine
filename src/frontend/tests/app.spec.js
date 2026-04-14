import { test, expect } from './fixtures.js';

test.describe.configure({ mode: 'serial' });

test.describe('Application launch', () => {
    test('Main window is visible', async ({ appPage, electronApp }) => {
        await appPage.waitForSelector('nav.navbar:not(.footer)');
        const isVisible = await electronApp.evaluate(({ BrowserWindow }) => {
            const wins = BrowserWindow.getAllWindows();
            return wins.length > 0 && wins[0].isVisible();
        });
        expect(isVisible).toBe(true);
    });

    test('Window title is set', async ({ electronApp }) => {
        const title = await electronApp.evaluate(({ BrowserWindow }) => {
            return BrowserWindow.getAllWindows()[0].getTitle();
        });
        expect(title).toBeTruthy();
    });

    test('Renders the app heading', async ({ appPage }) => {
        await expect(appPage.locator('h2')).toHaveText('Technology Migration Engine');
    });

    test('Renders the navbar', async ({ appPage }) => {
        await expect(appPage.locator('nav.navbar:not(.footer)')).toBeVisible();
    });

    test('Navbar has a left and right section', async ({ appPage }) => {
        await expect(appPage.locator('nav.navbar:not(.footer) .navbar-left')).toBeVisible();
        await expect(appPage.locator('nav.navbar:not(.footer) .navbar-right')).toBeVisible();
    });

    test('No unhandled error overlay is shown', async ({ appPage }) => {
        await expect(appPage.locator('.interface-error')).not.toBeVisible();
    });
});
