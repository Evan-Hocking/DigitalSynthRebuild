const { contextBridge, ipcRenderer } = require('electron');



contextBridge.exposeInMainWorld('synthAPI', {
  getModulePaths: () => ipcRenderer.invoke('get-module-paths'),
});