import { test, expect } from './fixtures.js';

test.describe.configure({ mode: 'serial' });

const getModal = (appPage) => appPage.locator('div.modal');

// CSS :has() avoids scoped-locator issues with Playwright's filter({ has }) API
const getFormGroup = (modal, labelText) =>
    modal.locator(`.form-group:has(label:has-text("${labelText}"))`);

test.describe('Add Agent modal', () => {
    test.beforeEach(async ({ appPage }) => {
        const modal = getModal(appPage);
        if (await modal.isVisible()) {
            const closeBtn = modal.locator('button.modal__close');
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
            }
            await expect(modal).not.toBeVisible();
        }
    });

    test('Clicking "Add Agent" opens the floating window', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        await expect(getModal(appPage)).toBeVisible();
    });

    test('Modal title is "Agent Picker"', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        await expect(getModal(appPage).locator('.modal__header span')).toHaveText('Agent Picker');
    });

    test('Modal has a Templates dropdown', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        await expect(modal.locator('select.agent-form-select')).toBeVisible();
    });

    test('Default template pre-fills the Name field with "OpenAI Chat Completions"', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        const nameInput = getFormGroup(modal, 'Name').locator('input');
        await expect(nameInput).toHaveValue('OpenAI Chat Completions');
    });

    test('All required form fields are present', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);

        await expect(getFormGroup(modal, 'Name').locator('input')).toBeVisible();
        await expect(getFormGroup(modal, 'Endpoint URL').locator('input')).toBeVisible();
        await expect(modal.locator('textarea')).toBeVisible();
        await expect(
            modal.locator('input[placeholder="e.g. choices[0].message.content"]')
        ).toBeVisible();
    });

    test('Selecting a different template updates the Name field', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        const templateSelect = modal.locator('select.agent-form-select');
        const nameInput = getFormGroup(modal, 'Name').locator('input');

        await templateSelect.selectOption({ label: 'Anthropic Claude' });
        await expect(nameInput).toHaveValue('Anthropic Claude');
    });

    test('Clearing the response path shows "Response field path is required"', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        const responsePathInput = modal.locator('input[placeholder="e.g. choices[0].message.content"]');

        await responsePathInput.clear();
        await expect(modal.locator('.field-error-text')).toContainText('Response field path is required');
    });

    test('Invalid response path shows a format error', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        const responsePathInput = modal.locator('input[placeholder="e.g. choices[0].message.content"]');

        await responsePathInput.fill('!!invalid!!');
        await expect(modal.locator('.field-error-text')).toContainText('Response field path is invalid');
    });

    test('Request body missing {{PROMPT}} shows a validation error', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        const bodyTextarea = modal.locator('textarea');

        await bodyTextarea.fill('{"model": "gpt-4o-mini"}');
        await expect(
            modal.locator('.field-error-text').filter({ hasText: '{{PROMPT}}' })
        ).toBeVisible();
    });

    test('Save button has static style when there are validation errors', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        const responsePathInput = modal.locator('input[placeholder="e.g. choices[0].message.content"]');

        await responsePathInput.clear();

        const saveBtn = modal.locator('button.button', { hasText: 'Save' });
        await expect(saveBtn).toHaveClass(/button-static/);
    });

    test('Closing with ✕ hides the modal', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        await expect(modal).toBeVisible();

        await modal.locator('button.modal__close').click();
        await expect(modal).not.toBeVisible();
    });

    test('Closing with Cancel hides the modal', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        const modal = getModal(appPage);
        await expect(modal).toBeVisible();

        await modal.locator('.modal__footer button', { hasText: 'Cancel' }).click();
        await expect(modal).not.toBeVisible();
    });

    test('Re-opening the modal resets the form to the default template', async ({ appPage }) => {
        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        let modal = getModal(appPage);
        const responsePathInput = modal.locator('input[placeholder="e.g. choices[0].message.content"]');
        await responsePathInput.fill('INVALID');

        await modal.locator('button.modal__close').click();
        await expect(modal).not.toBeVisible();

        await appPage.locator('button.button', { hasText: 'Add Agent' }).click();
        modal = getModal(appPage);

        await expect(
            modal.locator('input[placeholder="e.g. choices[0].message.content"]')
        ).toHaveValue('choices[0].message.content');
    });
});
