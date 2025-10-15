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


        latestPingResponse.set(response);
        pingPoint.update(path => [...path, point]);


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

		try {
	
			const currentData = await window.api.getUserData();


			const updatedData = {
				...currentData,
				sessions: [
				...(currentData.sessions || []),
				{
					timestamp: Date.now(),
					path: get(pingPoint),

				},
			],
		};

		await window.api.updateUserData(updatedData);

		console.log('[FORMATION] Session saved.');
		} catch (e) {
		console.error('[FORMATION] Failed to save session:', e);
		}


        pingPoint.set([]);
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
