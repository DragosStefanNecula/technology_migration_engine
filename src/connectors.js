import { ipcMain } from 'electron';
import { handleFileUpload } from './backend/handlers.js';
import Store from 'electron-store';

export function registerConnectors() {
    ipcMain.on('file-upload', (event, fileData) => {
        const { name, content } = fileData;
        event.sender.send('set-value', handleFileUpload(content));
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
}