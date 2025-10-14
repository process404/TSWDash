import { writable, derived } from 'svelte/store';

export interface LatLng {
	lat: number;
	lon: number;
	timestamp: number;
}

export interface SessionData {
	startTime: number | null;
	endTime: number | null;
	path: LatLng[];
}

const initialSession: SessionData = {
	startTime: null,
	endTime: null,
	path: []
};

export const sessionStore = writable<SessionData>({ ...initialSession });

export function startSession() {
	sessionStore.update(s => ({
		...s,
		startTime: Date.now(),
		endTime: null,
		path: []
	}));
}

export function endSession() {
	sessionStore.update(s => ({
		...s,
		endTime: Date.now()
	}));
}

export function addToPath(lat: number, lon: number) {
	sessionStore.update(s => {
		if (s.startTime !== null) {
			s.path.push({ lat, lon, timestamp: Date.now() });
		}
		return s;
	});
}
