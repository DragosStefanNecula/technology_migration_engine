import { app, BrowserWindow, ipcMain } from 'electron';
import { registerConnectors } from './connectors.js';

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
