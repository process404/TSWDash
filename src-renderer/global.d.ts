export {};

declare global {
	interface Window {
		toggleDevTools: () => void;
		setTitleBarColors: (bgColor: string, iconColor: string) => void;

		api: {
			getUserData: () => Promise<any>;
			updateUserData: (data: any) => Promise<any>;
		};
	}
}
