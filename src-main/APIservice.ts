import axios from 'axios';
import type { Low } from 'lowdb';
import type { Data } from './storage';

/**
 * Pings the TSW API using saved API address and key.
 * 
 * @param db - The initialised LowDB database instance
 * @returns The formation data or null if an error occurs
 */
export default async function pingFormation(db: Low<Data>): Promise<any | null> {
  const apiAddress = db.data?.userData?.settings?.apiAddress;
  const apiKey = db.data?.userData?.settings?.apiKey;

  if (!apiAddress || !apiKey) {
    console.warn('Missing API address or API key.');
    return null;
  }

  const url = `${apiAddress}/get/CurrentFormation/0.LatLon`;

  try {
    const response = await axios.get(url, {
      headers: {
        'DTGCommKey': apiKey,
      },
    });

    console.log('[pingFormation] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[pingFormation] Error:', error.message);
    return null;
  }
}

export async function getTrainStock(db: Low<Data>): Promise<any | null> {
  const apiAddress = db.data?.userData?.settings?.apiAddress;
  const apiKey = db.data?.userData?.settings?.apiKey;

  if (!apiAddress || !apiKey) {
    console.warn('Missing API address or API key.');
    return null;
  }

  const url = `${apiAddress}/get/CurrentFormation/0.ObjectClass`;

  try {
    const response = await axios.get(url, {
      headers: {
        'DTGCommKey': apiKey,
      },
    });

    console.log('[pingStock] Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[pingStock] Error:', error.message);
    return null;
  }

}


