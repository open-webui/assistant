// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  on(event, callback) {
    ipcRenderer.on(event, callback);
  },

  checkConnection: () => ipcRenderer.invoke("check-connection"),
  getModels: () => ipcRenderer.invoke("get-models"),
  selectModel: (modelId) => ipcRenderer.invoke("select-model", modelId),
  loadConfig: () => ipcRenderer.invoke("load-config"),
  saveConfig: (data) => ipcRenderer.send("save-config", data),
});
