export {};

declare global {
	interface Window {
		toggleDevTools: () => void;
		setTitleBarColors: (bgColor: string, iconColor: string) => void;

		api: {
			getUserData: () => Promise<any>;
			updateUserData: (data: any) => Promise<any>;
			pingFormation: () => Promise<any>;
			openExternalLink: (url: string) => Promise<boolean>;
			saveSettings: (address: any, key: any) => Promise<void>;
		};
	}
}
