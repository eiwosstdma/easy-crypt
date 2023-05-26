/**
 *
 */
import { join } from 'node:path';
import { homedir } from 'node:os';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { randomBytes, randomUUID } from 'node:crypto';

import { isPathValid } from './utils';
import { Configuration } from './types';

/**
 *
 */
export default function () {
  const pathToDefaultFolder = join(homedir(), 'easy-crypt');

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

  } catch (e) {
    console.error(e);
  }
}
