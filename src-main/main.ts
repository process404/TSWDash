import { app, BrowserWindow, ipcMain, protocol, net } from 'electron';
import path from 'path';
import url from 'url';
import { stat } from 'node:fs/promises';
import { initialiseDatabase } from './storage.ts'; 
import pingFormation from './APIservice.ts';
import { getTrainStock } from './APIservice.ts'; 
import express from 'express';
import { networkInterfaces } from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


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
    title:"TSW Link",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			preload: path.join(import.meta.dirname, '../preload/preload.js')
		},
	});

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' }); 
    mainWindow.loadURL('http://localhost:5173');
  }
  
  if (!isDev) {
    const appServer = express();

    const rendererPath = path.join(__dirname, '../../out/renderer');
    appServer.use(express.static(rendererPath));

    appServer.get('/*', (req, res) => {
      res.sendFile(path.join(rendererPath, 'index.html'));
    });

    appServer.listen(3000, '0.0.0.0', () => {
      const nets = networkInterfaces();
      const ips = Object.values(nets)
        .flat()
        .filter((n) => n && n.family === 'IPv4' && !n.internal)
        .map((n) => n?.address);

      console.log('Available on:');
      console.log(`  → http://localhost:3000`);
      ips.forEach((ip) => console.log(`  → http://${ip}:3000`));
    });
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

  ipcMain.handle('get-train-stock', async () => {
    return getTrainStock(db);
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

