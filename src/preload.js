import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    sendReady: () => ipcRenderer.send('renderer-ready'),
    onSetValue: (callback) => ipcRenderer.on('set-value', callback),
    uploadFile: (fileData) => ipcRenderer.send('file-upload', fileData),
});