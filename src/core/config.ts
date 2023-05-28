/**
 *
 */
import { join } from 'node:path';
import { homedir } from 'node:os';
import { mkdirSync, writeFileSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';

import { isPathValid } from './utils';
import { Configuration } from './types';
import { dbConnection } from './db';

/**
 *
 */
export default function (path?: string) {
  const pathToDefaultFolder = path ?? join(homedir(), 'easy-crypt');

  try {
    const pathExist = isPathValid(pathToDefaultFolder);
    if (!pathExist) {
      mkdirSync(pathToDefaultFolder);
      mkdirSync(join(pathToDefaultFolder, 'errors'));
      mkdirSync(join(pathToDefaultFolder, 'data'));
    }

    const logExist = isPathValid(join(pathToDefaultFolder, 'logs.txt'));
    if (!logExist)
      writeFileSync(join(pathToDefaultFolder, 'logs.txt'), 'LOGS:\n');

    const confExist = isPathValid(join(pathToDefaultFolder, 'configuration.json'));
    if (!confExist) {
      const conf: Configuration = {
        id: randomUUID(),
        salt_1: randomBytes(16).toString('hex'),
        salt_2: randomBytes(16).toString('hex')
      };

      writeFileSync(join(pathToDefaultFolder, 'configuration.json'), JSON.stringify(conf));
    }

    const db = dbConnection(join(pathToDefaultFolder, 'sqlite.db'));
    /**
     * Create table for cryptographic values
     */
    db.exec(`
      create table if not exists crypt_val(
          created_at text not null default current_timestamp,
          label text not null,
          content text not null,
          salt text not null,
          iv text not null);
    `.trim());

    /**
     * Create table for users
     */
    db.exec(`
      create table if not exists users(
          created_at text not null default current_timestamp,
          uuid text not null, 
          name text not null unique,
          salt text not null,
          pass text not null,
          default int not null default 0
      );
    `.trim());

    db.close();
  } catch (e) {
    console.error(e);
  }
}
