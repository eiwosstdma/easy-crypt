/**
 *
 */
import { homedir } from 'node:os';
import { join } from 'node:path';
import { accessSync, readFileSync, appendFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { randomBytes, randomUUID } from 'node:crypto';

import { guardConfiguration } from './guards';
import { CustomErr, Users } from './types';
import { generatePassword } from './crypt';
import prompt from 'prompt';

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
      },
      purge: {
        type: 'boolean',
        short: 'p'
      },
      set: {
        type: 'string',
        short: 's'
      },
      salt: {
        type: 'string',
        short: 't'
      }
    }
  });

  return values;
}

export function handleError(err: CustomErr) {
  const basePath = join(homedir(), 'easy-crypt', 'errors');

  try {
    const formatedDate = err.created_at
      .toLocaleString()
      .replaceAll('/', '-')
      .replaceAll(' ', '_')
      .replaceAll(':', '-');

    const rand = Math.floor(Math.random() *1000000000000);
    const fileName = `error_${formatedDate}_${rand}.txt`;
    const filePath = join(basePath, fileName);
    const str = err.stringifies(filePath);

    writeFileSync(filePath, str);
    console.error(err.message);
  } catch(err) {
    console.error('An unknown error occurred, cannot generate a file for the following error.\n', err);
  }

  process.exit(1);
}

export function generateUser(name: string, pass: string): Omit<Users, 'rowid' | 'created_at' | 'default_user'> {
  const id = randomUUID().toString();
  const salt = randomBytes(16).toString('hex');
  const password = generatePassword(
    pass,
    salt,
  );

  return {
    uuid: id,
    name,
    salt,
    pass: password.toString('hex')
  };
}

export async function getUserPassword(): Promise<string> {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.delimiter = '';
    prompt.message = 'Insert your ';
    prompt.get({
      properties: {
        password: {
          type: 'string',
          required: true,
          hidden: true
        }
      }
    }, (err, result) => {
      if (err) reject(err);

      if (typeof result.password === 'string')
        resolve(result.password as string);
      else reject('Input is not a password.');
    });
  });
}

export async function getUserHiddenInput(): Promise<string> {
  return new Promise((resolve, reject) => {
    prompt.start();
    prompt.delimiter = '';
    prompt.message = 'Insert your hidden ';
    prompt.get({
      properties: {
        input: {
          type: 'string',
          required: true,
          hidden: true,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          replace: '*'
        }
      }
    }, (err, result) => {
      if (err) reject(err);

      if (typeof result.input !== 'string')
        reject('Input is not a string.');

      resolve(result.input as string);
    });
  });
}
