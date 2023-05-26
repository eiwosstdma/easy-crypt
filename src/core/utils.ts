/**
 *
 */
import { join } from 'node:path';
import { accessSync } from 'node:fs';

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
