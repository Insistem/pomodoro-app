const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, Notification, shell } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow
let tray
let trayTitle = '🍅'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 680,
    minWidth: 380,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    backgroundColor: '#16141a',
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault()
      mainWindow.hide()
    }
  })
}

function createTray() {
  // 用文字生成托盘图标（兼容无图片文件的情况）
  const iconPath = path.join(__dirname, '../assets/icon.png')
  let icon
  try {
    icon = nativeImage.createFromPath(iconPath)
    if (icon.isEmpty()) throw new Error('empty')
  } catch {
    icon = nativeImage.createEmpty()
  }

  tray = new Tray(icon)
  tray.setTitle(trayTitle)
  tray.setToolTip('番茄时钟')

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => mainWindow.show() },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.isQuitting = true
        app.quit()
      },
    },
  ])

  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

// IPC: 更新托盘标题（显示剩余时间）
ipcMain.on('update-tray', (_, text) => {
  trayTitle = text
  if (tray) tray.setTitle(text)
})

// IPC: 发送系统通知
ipcMain.on('notify', (_, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body, silent: false }).show()
  }
})

// IPC: 窗口控制
ipcMain.on('window-minimize', () => mainWindow.minimize())
ipcMain.on('window-close', () => mainWindow.hide())

// IPC: 获取系统存储路径（用于持久化数据）
ipcMain.handle('get-user-data-path', () => app.getPath('userData'))

app.whenReady().then(() => {
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  app.isQuitting = true
})
