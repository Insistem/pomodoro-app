const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  updateTray: (text) => ipcRenderer.send('update-tray', text),
  notify: (title, body) => ipcRenderer.send('notify', { title, body }),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
})
