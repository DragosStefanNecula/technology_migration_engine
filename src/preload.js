import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onSetValue: (callback) => ipcRenderer.on('set-value', callback)
});