// src-preload/render.ts

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

const exposeInRenderer = {
	toggleDevTools: () => ipcRenderer.send('toggleDevTools'),
	setTitleBarColors: (bgColor: string, iconColor: string) => {
		document.documentElement.style.background = bgColor;
		ipcRenderer.send('setTitleBarColors', bgColor, iconColor);
	},

	api: {
		getUserData: () => ipcRenderer.invoke('get-user-data'),
		updateUserData: (data: any) => ipcRenderer.invoke('update-user-data', data),
		pingFormation: () => ipcRenderer.invoke('ping-formation'),
		openExternalLink: (url: string) => ipcRenderer.invoke('open-external-link', url),
		saveSettings: (address: any, key: any) => ipcRenderer.invoke('save-settings', address, key),
	},
};

for (const [key, value] of Object.entries(exposeInRenderer)) {
	contextBridge.exposeInMainWorld(key, value);
}

export type ExposeInRendererTypes = typeof exposeInRenderer;
