import { app } from 'electron';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import fs from 'fs-extra';
import { UserData } from '../types/user-data.js';

export interface Data {
  userData: {
    settings: {
      apiAddress: string;
      apiKey: string;
    };
  };
}

export async function initialiseDatabase(): Promise<Low<Data>> {
  const appDataPath = app.getPath('userData');
  const dbPath = path.join(appDataPath, 'db.json');

  await fs.ensureDir(appDataPath);

  const adapter = new JSONFile<Data>(dbPath);
  const db = new Low<Data>(adapter, {
    userData: {
      settings: {
        apiAddress: '',
        apiKey: '',
      },
    },
  });

  await db.read();

  db.data ||= {
    userData: {
      settings: {
        apiAddress : '',
        apiKey: '',
      },
    },
  };

  await db.write();

  return db;
}