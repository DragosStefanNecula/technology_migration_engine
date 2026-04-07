import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    sendReady: () => ipcRenderer.send("renderer-ready"),
    onSetValue: (callback) => ipcRenderer.on("set-value", callback),
    onFileUploadError: (callback) => ipcRenderer.on("file-upload-error", callback),
    uploadFile: (fileData) => ipcRenderer.send("file-upload", fileData),
    saveJavaFile: (content) => ipcRenderer.invoke('save-java-file', content)
});

contextBridge.exposeInMainWorld('aiAPI', {
    firstPassGenAi: async (sourceContext, runningContext, node, selectedAgent) => {
        return await ipcRenderer.invoke('ai-process-node', sourceContext, runningContext, node, selectedAgent);
    },
    secondPassGenAi: async (sourceContext, firstPassText, selectedAgent) => {
        return await ipcRenderer.invoke('ai-process-block', sourceContext, firstPassText, selectedAgent);
    },
    hotTipGenAi: async (sourceContext, finalText, selectedAgent) => {
        return await ipcRenderer.invoke('ai-process-text', sourceContext, finalText, selectedAgent);
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
