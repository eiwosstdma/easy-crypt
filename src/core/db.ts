/**
 *
 */
import { join } from 'node:path';
import { homedir } from 'node:os';
import Database from 'better-sqlite3';

/**
 *
 */
export function dbConnection(path?: string) {
  const realPath = path ?? join(homedir(), 'easy-crypt', 'sqlite.db');
  try {
    return Database(realPath);
  } catch(e) {
    console.error(`Cannot connect to the SQLITE file at ${realPath}.\n${e}`);
    throw e;
  }
}
