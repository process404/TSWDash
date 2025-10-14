import { writable } from 'svelte/store';

export type PingResponse = 
  | { Result: 'Success'; Values: { Lat: number; Lon: number } }
  | { Result: 'Error' };

export const formationError = writable(false);
export const latestPingResponse = writable<PingResponse | null>(null);