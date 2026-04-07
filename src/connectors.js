import { ipcMain, dialog } from 'electron';
import { handleFileUpload } from './backend/handlers.js';
import Store from 'electron-store';
import { processNodeWithAi, processBlockWithAi, processTextWithAi } from './backend/agent/agentRequester.js';
import fs from 'fs';

export function registerConnectors() {
    ipcMain.on('file-upload', (event, fileData) => {
        const { content } = fileData;
        try {
            const processedValue = handleFileUpload(content);
            event.sender.send('set-value', processedValue);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            event.sender.send('file-upload-error', message);
        }
    });

    ipcMain.handle('save-java-file', async (event, content) => {
        const { cancelled, filePath } = await dialog.showSaveDialog({
            title: 'Save Java File',
            defaultPath: 'Functions.java',
            filters: [
                { name: 'Java Files', extensions: ['java'] }
            ]
        });

        if (cancelled || !filePath) return;

        fs.writeFileSync(filePath, content, 'utf-8');
        return filePath;
    });

    const store = new Store();

    ipcMain.on('save-api-config', (event, apiConfigObject) => {
        if (!apiConfigObject.name) {
            return event.reply('save-api-config-response', { success: false });
        }

        const existingConfigs = store.get('apiConfigs', {});
        existingConfigs[apiConfigObject.name] = apiConfigObject;
        store.set('apiConfigs', existingConfigs);

        event.reply('save-api-config-response', { success: true, name: apiConfigObject.name });
    });

    ipcMain.on('get-api-config-names', (event) => {
        const existingConfigs = store.get('apiConfigs', {});
        const names = Object.keys(existingConfigs);
        event.reply('get-api-config-names-response', names);
    });

    ipcMain.on('get-api-config', (event, name) => {
        const existingConfigs = store.get('apiConfigs', {});
        const config = existingConfigs[name] || null;
        event.reply('get-api-config-response', config);
    });

    ipcMain.on('edit-api-config', (event, { oldName, apiConfigObject }) => {
        if (!oldName || !apiConfigObject.name) {
            return event.reply('edit-api-config-response', {
                success: false,
                error: "Both oldName and new config name are required"
            });
        }

        const existingConfigs = store.get('apiConfigs', {});

        if (!existingConfigs[oldName]) {
            return event.reply('edit-api-config-response', {
                success: false,
                error: `Config "${oldName}" does not exist`
            });
        }

        // If the name changed, remove the old key
        if (oldName !== apiConfigObject.name) {
            delete existingConfigs[oldName];
        }

        // Save the updated config under the new name
        existingConfigs[apiConfigObject.name] = apiConfigObject;
        store.set('apiConfigs', existingConfigs);

        event.reply('edit-api-config-response', { success: true, name: apiConfigObject.name });
    });

    ipcMain.on('delete-api-config', (event, name) => {
        if (!name) {
            return event.reply('delete-api-config-response', { success: false, error: "No name provided" });
        }

        const existingConfigs = store.get('apiConfigs', {});

        if (!existingConfigs[name]) {
            return event.reply('delete-api-config-response', { success: false, error: `Config "${name}" does not exist` });
        }

        delete existingConfigs[name];
        store.set('apiConfigs', existingConfigs);

        event.reply('delete-api-config-response', { success: true, name });
    });

    ipcMain.handle('ai-process-node', async (event, sourceContext, runningContext, node, selectedAgent) => {
    const result = await processNodeWithAi(sourceContext, runningContext, node, selectedAgent);
        return result;
    });

    ipcMain.handle('ai-process-block', async (event, sourceContext, firstPassText, selectedAgent) => {
    const result = await processBlockWithAi(sourceContext, firstPassText, selectedAgent);
        return result;
    });

    ipcMain.handle('ai-process-text', async (event, sourceContext, finalText, selectedAgent) => {
    const result = await processTextWithAi(sourceContext, finalText, selectedAgent);
        return result;
    });
}