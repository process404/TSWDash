import { writable, get } from 'svelte/store';

export type PingResponse = {
	Result: 'Success' | 'Error';
	Values?: {
		Lat: number;
		Lon: number;
	};
};

export const latestPingResponse = writable<PingResponse | null>(null);
export type PingPoint = {
  lat: number;
  lon: number;
  timestamp: number;
  speed?: number;           
  heading?: number;        
  trainId?: string;        
  stationProximity?: string; 
};

export const pingPoint = writable<PingPoint[]>([]);
export const sessionActive = writable(false);

let pingInterval = 2000;
let pingLoopRunning = false;
let pingLoopActive = false;

let missedPings = 0;
const maxMissedPings = 3;

export async function startPingFormationLoop() {
	if (pingLoopRunning) return;
	pingLoopRunning = true;
	pingLoopActive = true;

	while (pingLoopActive) {
		try {
			const response: PingResponse = await window.api.pingFormation();

			if (response.Result === 'Success' && response.Values) {
				const { Lat, Lon } = response.Values;
				const point: PingPoint = {
					lat: Lat,
					lon: Lon,
					timestamp: Date.now(),
					speed: 0,      
					heading: 0,   
				};

				// Record live position
				latestPingResponse.set(response);
				pingPoint.update(path => [...path, point]);

				// If recovering from lost pings, start new session path
				if (missedPings >= maxMissedPings) {
					console.log('[FORMATION] Reconnected – new session started');
					pingPoint.set([point]);
				}

				missedPings = 0;
				sessionActive.set(true);
			} else {
				missedPings++;
			}
		} catch (err) {
			console.error('[FORMATION] Ping error:', err);
			missedPings++;
		}

		if (missedPings >= maxMissedPings) {
			if (get(sessionActive)) {
				console.log('[FORMATION] Session ended.');
			}
			sessionActive.set(false);
			latestPingResponse.set(null);
		}

		await new Promise(resolve => setTimeout(resolve, pingInterval));
	}

	pingLoopRunning = false;
}

export function stopPingFormationLoop() {
	pingLoopActive = false;
	pingLoopRunning = false;
	sessionActive.set(false);
	latestPingResponse.set(null);
	pingPoint.set([]);
}
