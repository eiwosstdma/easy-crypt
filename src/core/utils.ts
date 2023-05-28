/**
 *
 */
import { homedir } from 'node:os';
import { join } from 'node:path';
import { accessSync, readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { randomBytes, randomUUID, pbkdf2Sync } from 'node:crypto';

import { guardConfiguration } from './guards';
import { CustomErr, Users } from './types';
import { message } from 'prompt';

/**
 *
 */
export function isPathValid(path: string) {
  try {
    accessSync(path);
    return true;
  } catch(e) {
    return false;
  }
}

export function loadConfiguration(path?: string) {
  try {
    const pathToConfiguration = path ?? join(homedir(), 'easy-crypt', 'configuration.json');
    const isValid = isPathValid(pathToConfiguration);

    if (!isValid)
      throw new Error('Cannot access configuration file at ' + pathToConfiguration);

    const file = JSON.parse(readFileSync(pathToConfiguration, { encoding: 'utf8' }));
    const isConfiguration = guardConfiguration(file);

    if (!isConfiguration)
      throw new Error(`Configuration file at ${pathToConfiguration} is corrupted.`);

    return file;
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

export function addLog(content: string, zone: string, path?: string) {
  try {
    const moment = new Date().toLocaleString();
    const str = `\r\n${moment}--- ${zone} ::: "${content}";;;`;
    const pathToLogFile = path ?? join(homedir(), 'easy-crypt', 'logs.txt');
    const isValid = isPathValid(pathToLogFile);

    if (!isValid)
      throw new Error('Cannot access log file at ' + pathToLogFile);

    appendFileSync(pathToLogFile, str);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

export function args() {
  const { values } = parseArgs({
    strict: false,
    options: {
      help: {
        type: 'boolean',
        short: 'h'
      },
      use: {
        type: 'string',
        short: 'u'
      },
      force: {
        type: 'boolean',
        short: 'f'
      }
    }
  });

  return values;
}

export function handleError(err: CustomErr) {
  const basePath = join(homedir(), 'easy-crypt', 'errors');
  try {
    const rand = Math.floor(Math.random() *1000000000000);
    const fileName = `error_${err.zone}_${rand}.txt`;
    let str = 'ERROR\n';
    str += err.created_at;
    str += '\n';
    str += err.zone;
    str += '\nMessage: ';
    str += err.message;
    str += '\nContent: ';
    str += JSON.stringify(err.content);

    writeFileSync(join(basePath, fileName), str);
  } catch(err) {
    console.error('An unknown error occurred, cannot generate an error file.\n', err);
  }
}

export function generatePassword(pass: string, salt: string, metadata: string, iteration?: number, length?: number): Buffer {
  const bufferPass = Buffer.from(pass);
  const bufferSalt = Buffer.from(salt, 'hex');
  const bufferMetadata = Buffer.from(metadata);
  return pbkdf2Sync(
    bufferPass,
    Buffer.concat([ bufferSalt, bufferMetadata ]),
    iteration ?? 10000,
    length ?? 16,
    'sha512'
  );
}
export function generateUser(name: string, pass: string): Omit<Users, 'rowid' | 'created_at'> {
  const id = randomUUID().toString();
  const salt = randomBytes(16).toString('hex');
  const password = generatePassword(
    pass,
    salt,
    id+name,
  );

  return {
    uuid: id,
    name,
    salt,
    pass: password.toString('hex')
  };
}
