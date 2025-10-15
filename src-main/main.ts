import { app, BrowserWindow, ipcMain, protocol, net } from 'electron';
import path from 'path';
import url from 'url';
import { stat } from 'node:fs/promises';
import { initialiseDatabase } from './storage.ts'; 
import pingFormation from './APIservice.ts';
import express from 'express';
import { networkInterfaces } from 'os';

const appServer = express();
appServer.use(express.static('dist'));

appServer.listen(3000, '0.0.0.0', () => {
  const nets = networkInterfaces();
  const addresses = Object.values(nets)
    .flat()
    .filter((net) => net && net.family === 'IPv4' && !net.internal)
    .map((net) => net?.address);

  console.log('Available on:');
  console.log(`  → http://localhost:3000`);
  addresses.forEach((addr) => console.log(`  → http://${addr}:3000`));
});

import electronSquirrelStartup from 'electron-squirrel-startup';
if (electronSquirrelStartup) app.quit();

if (!app.requestSingleInstanceLock()) app.quit();

app.on('second-instance', () => {
  createWindow();
});

const scheme = 'app';
const srcFolder = path.join(app.getAppPath(), `.vite/main_window/`);
const isDev = process.env.NODE_ENV === 'development';

const staticAssetsFolder = isDev
  ? path.join(import.meta.dirname, '../../static/')
  : srcFolder;

protocol.registerSchemesAsPrivileged([
  {
    scheme,
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: false,
      stream: true,
      codeCache: true,
    },
  },
]);

let db: any;

async function setupProtocol() {
  protocol.handle(scheme, async (request) => {
    const requestPath = path.normalize(decodeURIComponent(new URL(request.url).pathname));

    async function isFile(filePath: string) {
      try {
        if ((await stat(filePath)).isFile()) return filePath;
      } catch {}
    }

    const responseFilePath =
      (await isFile(path.join(srcFolder, requestPath))) ??
      (await isFile(path.join(srcFolder, path.dirname(requestPath), `${path.basename(requestPath) || 'index'}.html`))) ??
      path.join(srcFolder, '200.html');

    return await net.fetch(url.pathToFileURL(responseFilePath).toString());
  });
}

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 900,
		height: 700,
		titleBarStyle: 'hidden', 
		titleBarOverlay: {
			color: '#ffffff',    
			symbolColor: '#000000', 
			height: 40,           
		},
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: path.join(import.meta.dirname, '../preload/preload.js')
		},
	});

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' }); 
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadURL('app://-/');
  }
}

app.whenReady().then(async () => {
  await setupProtocol();

  db = await initialiseDatabase();

  ipcMain.handle('get-user-data', async () => db.data.userData);

  ipcMain.handle('update-user-data', async (_event, newData) => {
    db.data.userData = newData;
    await db.write();
    return db.data.userData;
  });

  ipcMain.handle('ping-formation', async () => {
    return pingFormation(db);
  });

  ipcMain.handle('open-external-link', async (_event, link) => {
      try {
        const { shell } = await import('electron');
        await shell.openExternal(link);
        return true;
      } catch (error) {
        console.error('Failed to open external link:', error);
        return false;
      }
  });

  ipcMain.handle('save-settings', async (_event, address, key) => {
    db.data.userData.settings.apiAddress = address;
    db.data.userData.settings.apiKey = key;
    await db.write();
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('toggleDevTools', (event) => event.sender.toggleDevTools());
ipcMain.on('setTitleBarColors', (event, bgColor, iconColor) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window?.setTitleBarOverlay) return;
  window.setTitleBarOverlay({
    color: bgColor,
    symbolColor: iconColor,
    height: 40,
  });
});

