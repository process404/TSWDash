export type PingPoint = {
  lat: number;
  lon: number;
  timestamp: number;
  speed?: number;
  heading?: number;
  trainId?: string;
  stationProximity?: string;
};