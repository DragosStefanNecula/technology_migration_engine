import { test, expect } from './fixtures.js';

test.describe.configure({ mode: 'serial' });

test.describe('Mode Select', () => {
    test('Mode group label is visible', async ({ appPage }) => {
        const modeGroup = appPage.locator('.outlined-group').filter({
            has: appPage.locator('.outlined-group__label', { hasText: 'Mode' }),
        });
        await expect(modeGroup).toBeVisible();
    });

    test('The "Detailed" button is present', async ({ appPage }) => {
        await expect(appPage.locator('button.button', { hasText: 'Detailed' })).toBeVisible();
    });

    test('The "Full Pass" button is present', async ({ appPage }) => {
        await expect(appPage.locator('button.button', { hasText: 'Full Pass' })).toBeVisible();
    });

    test('One mode button is selected by default', async ({ appPage }) => {
        const selectedCount = await appPage.locator('.outlined-group').filter({
            has: appPage.locator('.outlined-group__label', { hasText: 'Mode' }),
        }).locator('button.button-selected').count();
        expect(selectedCount).toBe(1);
    });

    test('Clicking "Full Pass" marks it as selected', async ({ appPage }) => {
        const fullPassBtn = appPage.locator('button.button', { hasText: 'Full Pass' });
        await fullPassBtn.click();
        await expect(fullPassBtn).toHaveClass(/button-selected/);
    });

    test('Clicking "Detailed" toggles it back to selected', async ({ appPage }) => {
        const detailedBtn = appPage.locator('button.button', { hasText: 'Detailed' });
        await detailedBtn.click();
        await expect(detailedBtn).toHaveClass(/button-selected/);
    });

    test('The "Detailed" and "Full Pass" buttons are mutually exclusive', async ({ appPage }) => {
        const detailedBtn = appPage.locator('button.button', { hasText: 'Detailed' });
        const fullPassBtn = appPage.locator('button.button', { hasText: 'Full Pass' });

        await fullPassBtn.click();
        await expect(fullPassBtn).toHaveClass(/button-selected/);
        await expect(detailedBtn).not.toHaveClass(/button-selected/);

        await detailedBtn.click();
        await expect(detailedBtn).toHaveClass(/button-selected/);
        await expect(fullPassBtn).not.toHaveClass(/button-selected/);
    });
});

test.describe('Agent Bar', () => {
    test('Agent group label is visible', async ({ appPage }) => {
        const agentGroup = appPage.locator('.outlined-group').filter({
            has: appPage.locator('.outlined-group__label', { hasText: 'Agent' }),
        });
        await expect(agentGroup).toBeVisible();
    });

    test('The "Add Agent" button is visible', async ({ appPage }) => {
        await expect(appPage.locator('button.button', { hasText: 'Add Agent' })).toBeVisible();
    });

    test('Agent bar is in the navbar right section', async ({ appPage }) => {
        const navbarRight = appPage.locator('.navbar-right');
        await expect(
            navbarRight.locator('.outlined-group').filter({
                has: appPage.locator('.outlined-group__label', { hasText: 'Agent' }),
            })
        ).toBeVisible();
    });
});
