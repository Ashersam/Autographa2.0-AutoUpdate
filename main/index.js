// Native
const { join } = require('path');
const { format } = require('url');

// Packages
const { BrowserWindow, app, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');
const { autoUpdater } = require('electron-updater');

let mainWindow;
// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, 'preload.js'),
      additionalArguments: app.getPath('documents'),
    },
  });

  const url = isDev
    ? 'http://localhost:8000'
    : format({
      pathname: join(__dirname, '../renderer/out/index.html'),
      protocol: 'file:',
      slashes: true,
    });

  mainWindow.loadURL(url);

  autoUpdater.checkForUpdatesAndNotify();
});
// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event, message) => {
  event.sender.send('message', message);
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
