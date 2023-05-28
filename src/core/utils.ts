/**
 *
 */
import { homedir } from 'node:os';
import { join } from 'node:path';
import { accessSync, readFileSync, appendFileSync } from 'node:fs';
import { guardConfiguration } from './guards';

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
