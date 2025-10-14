/// <reference types="svelte" />
/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

import type { ExposeInRendererTypes } from './preload.js';

declare global {
	interface Window extends ExposeInRendererTypes {}

	// See https://kit.svelte.dev/docs/types#app
	// for information about these interfaces
	namespace App {
		interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};