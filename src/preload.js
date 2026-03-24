import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    sendReady: () => ipcRenderer.send("renderer-ready"),
    onSetValue: (callback) => ipcRenderer.on("set-value", callback),
    uploadFile: (fileData) => ipcRenderer.send("file-upload", fileData),
});

contextBridge.exposeInMainWorld('aiAPI', {
    genAi: async (sourceContext, runningContext, nodeData) => {
        return await ipcRenderer.invoke('ai-process-node', sourceContext, runningContext, nodeData);
    }
});

contextBridge.exposeInMainWorld("apiStore", {
    saveApiConfig: (config) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once("save-api-config-response", (event, response) => {
                if (response.success) resolve(response);
                else reject(new Error("Failed to save API config"));
            });
            ipcRenderer.send("save-api-config", config);
        });
    },
    getApiConfigNames: () => {
        return new Promise((resolve) => {
            ipcRenderer.once("get-api-config-names-response", (event, names) => {
                resolve(names);
            });
            ipcRenderer.send("get-api-config-names");
        });
    },
    getApiConfig: (name) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once('get-api-config-response', (event, config) => {
                if (config) resolve(config);
                else reject(new Error(`No config found for ${name}`));
            });
            ipcRenderer.send('get-api-config', name);
        });
    },
    editApiConfig: (oldName, apiConfigObject) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once('edit-api-config-response', (event, res) => {
                if (res.success) resolve(res);
                else reject(new Error(res.error));
            });
            ipcRenderer.send('edit-api-config', { oldName, apiConfigObject });
        });
    },
    deleteApiConfig: (name) => {
        return new Promise((resolve, reject) => {
            ipcRenderer.once('delete-api-config-response', (event, res) => {
                if (res.success) resolve(res);
                else reject(new Error(res.error));
            });
            ipcRenderer.send('delete-api-config', name);
        });
    }
});
