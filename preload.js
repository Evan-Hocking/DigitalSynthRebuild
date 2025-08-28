const { contextBridge, ipcRenderer } = require('electron');



contextBridge.exposeInMainWorld('synthAPI', {
  getModulePaths: () => ipcRenderer.invoke('get-module-paths'),
});


contextBridge.exposeInMainWorld('electronAPI', {
  getStoredTheme: () => ipcRenderer.sendSync('get-stored-theme'),
  onThemeChanged: (callback) => ipcRenderer.on('theme-changed', callback)
});