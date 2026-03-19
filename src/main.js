import { app, BrowserWindow, ipcMain } from 'electron';
import { registerConnectors } from './connectors.js';
import Store from 'electron-store';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { dirname } from 'path';
import { fileURLToPath } from 'url';

//[[req1impl| ]] Adhers to [[#req1spec|Requirement 1]]
function createWindow() {
    registerConnectors();

    const win = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: `${__dirname}/preload.js`,
            nodeIntegration: true
        }
    });

    const isDev = process.env.NODE_ENV === 'development';
    const startURL = isDev
        ? 'http://localhost:5173' // Vite dev server
        : `file:/${__dirname}/frontend/dist/renderer/index.html`;

    win.loadURL(startURL);
    win.maximize();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
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