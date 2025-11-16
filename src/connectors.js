import { ipcMain } from 'electron';
import { handleFileUpload } from './backend/handlers.js';

export function registerConnectors(){

    ipcMain.on('file-upload', (event, fileData) => {
        const { name, content } = fileData;
        event.sender.send('set-value', handleFileUpload(content));
    });
    
}