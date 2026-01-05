const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { createCampusCardService } = require('./electron/services/campusCardService');

// Liquid Glass support (macOS 26+ only)
let liquidGlass = null;
const isMac = process.platform === 'darwin';
if (isMac) {
  try {
    const liquidGlassModule = require('electron-liquid-glass');
    liquidGlass = liquidGlassModule && liquidGlassModule.default ? liquidGlassModule.default : liquidGlassModule;
  } catch (e) {
    console.log('Liquid glass not available:', e.message);
  }
}

let mainWindow = null;
let glassViewId = null;

function toggleDevToolsDocked() {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const webContents = mainWindow.webContents;
  if (webContents.isDevToolsOpened()) {
    webContents.closeDevTools();
    return;
  }

  if (process.platform === 'win32') {
    webContents.openDevTools({ mode: 'right' });
  } else {
    webContents.openDevTools();
  }
}

function sendToRenderer(channel, data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, data);
  }
}

const campusCardService = createCampusCardService({
  log: (message) => sendToRenderer('log-message', message)
});

function createWindow() {
  const windowOptions = {
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    title: 'MyCampusCard',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true
    }
  };

  // macOS with Liquid Glass support
  if (isMac && liquidGlass) {
    windowOptions.transparent = true;
    // Do NOT enable vibrancy when using electron-liquid-glass.
    // If set, it can override the native glass view and look blurry.
    windowOptions.vibrancy = false;
    windowOptions.backgroundColor = '#00000000';
  } else {
    windowOptions.titleBarOverlay = {
      color: '#f5f5f7',
      symbolColor: '#1d1d1f',
      height: 32
    };
  }

  mainWindow = new BrowserWindow(windowOptions);

  // Apply Liquid Glass effect on macOS
  if (isMac && liquidGlass) {
    mainWindow.setWindowButtonVisibility(true);
    mainWindow.webContents.once('did-finish-load', () => {
      try {
        glassViewId = liquidGlass.addView(
          mainWindow.getNativeWindowHandle(),
          {
            cornerRadius: 12,
            tintColor: '#20f5f5f7'
          }
        );
      } catch (e) {
        console.log('Failed to apply liquid glass:', e.message);
      }
    });
  }

  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  createMenu();

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown') {
      if (input.key === 'F12') {
        toggleDevToolsDocked();
        event.preventDefault();
      }
      if (input.key === 'i' && input.shift && (input.control || input.meta)) {
        toggleDevToolsDocked();
        event.preventDefault();
      }
    }
  });

  mainWindow.on('closed', () => {
    // Clean up liquid glass view
    if (glassViewId && liquidGlass) {
      try {
        liquidGlass.removeView(glassViewId);
      } catch (e) {
        // Ignore cleanup errors
      }
      glassViewId = null;
    }
    mainWindow = null;
  });
}

function createMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        {
          label: 'Toggle Developer Tools',
          accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click: () => toggleDevToolsDocked()
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Language',
      submenu: [
        {
          label: 'English',
          click: () => {
            sendToRenderer('language-change', 'en-US');
          }
        },
        {
          label: '简体中文',
          click: () => {
            sendToRenderer('language-change', 'zh-CN');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  ipcMain.handle('save-image', async (event, { dataUrl, defaultName }) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Report Image',
      defaultPath: defaultName,
      filters: [
        { name: 'PNG Image', extensions: ['png'] },
        { name: 'JPEG Image', extensions: ['jpg', 'jpeg'] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    try {
      const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);
      return { success: true, filePath };
    } catch (error) {
      console.error('Save image error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('save-json', async (event, { data, defaultName }) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Transaction Data',
      defaultPath: defaultName,
      filters: [
        { name: 'JSON File', extensions: ['json'] }
      ]
    });

    if (canceled || !filePath) {
      return { success: false };
    }

    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true, filePath };
    } catch (error) {
      console.error('Save JSON error:', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('sso-login', async (event, { stuNo, password }) => {
    return await campusCardService.ssoLogin(stuNo, password);
  });

  ipcMain.handle('fetch-card-data', async (event, { minDate, maxDate, stuNo, sessionId }) => {
    return await campusCardService.fetchCardData(minDate, maxDate, stuNo, sessionId);
  });

  ipcMain.handle('fetch-user-info', async (event, { sessionId }) => {
    return await campusCardService.fetchUserInfo(sessionId);
  });

  ipcMain.handle('open-external', async (event, url) => {
    await shell.openExternal(url);
  });

  createWindow();
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
