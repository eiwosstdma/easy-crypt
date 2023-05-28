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
  return Database(realPath);
}
