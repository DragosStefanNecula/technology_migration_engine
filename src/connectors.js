import { ipcMain } from 'electron';
import { parse } from './backend/parser.js';

export function registerConnectors(){

    ipcMain.on('file-upload', (event, fileData) => {
    const { name, content } = fileData;

    event.sender.send('set-value', parse(content));
    });
    
}