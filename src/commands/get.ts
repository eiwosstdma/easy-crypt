import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

import { Database } from 'better-sqlite3';

import { getUserPassword, handleError, isPathValid } from '../core/utils';
import { CustomError } from '../objs/CustomError';
import { Configuration } from '../core/types';
import { guardCrypt_Value, guardUsers } from '../core/guards';
import { decrypt } from '../core/crypt';

export default async function(configuration: Configuration, db: Database, label: string, noclip: boolean, purge: boolean, salt?: string, output?: string) {
  let usableSalt = '';
  try {
    const labelExists = db.prepare('SELECT * FROM crypt_val WHERE label = ?').get(label);
    if (!labelExists)
      return console.error('The label has not been set.');

    if (purge) {
      const res = db.prepare('DELETE FROM crypt_val WHERE label = ?').run(label);

      if (res.changes === 0)
        return console.error('Database may be corrupted, please retry.');
      else
        return console.log('Value has been deleted.');
    }

    const defaultUser = db.prepare('SELECT ROWID, * FROM users WHERE default_user >= 1').get();
    const validUser = guardUsers(defaultUser);

    if (salt)
      usableSalt = salt;
    else if (!validUser)
      usableSalt = configuration.salt_1;
    else
      usableSalt = defaultUser.salt;

    const cryptValue = db.prepare('SELECT ROWID, * FROM crypt_val WHERE label = ?').get(label);
    const valueValid = guardCrypt_Value(cryptValue);

    if (!valueValid)
      return console.error('Data corrupted.');

    const password = await getUserPassword();

    let decrypted = '';
    try {
      decrypted = decrypt(cryptValue.content, password, usableSalt, cryptValue.salt, cryptValue.iv);
    } catch (e) {
      console.error('Unable to decrypt the content, please use the right password or user/root salt combinaison.');
    }

    if (output) {
      const pathExist = isPathValid(output);
      if (pathExist)
        return console.error(`Path at ${output} is already taken.`);

      const basePath = path.dirname(output);
      mkdirSync(basePath, { recursive: true });
      writeFileSync(output, decrypted);

      console.log(`Data has been wrote to ${output} successfully.`);
    }

    if (!noclip)
      clipper(decrypted);

  } catch(e) {

    handleError(new CustomError(
      'Error in usage of \'use\' command',
      'An error occurred while using the use command, more details in the logs at ',
      (e as Error).stack as string,
      e
    ));
  }
}

function clipper(data: string) {
  let whichOSClipper = '';

  if (process.platform === 'win32')
    whichOSClipper = 'clip';
  else if (process.platform === 'darwin')
    whichOSClipper = 'pbcopy';
  else if (process.platform === 'linux')
    whichOSClipper = 'xclip';
  else
    return console.error('Cannot copy content to clipboard, your platform is not supported.');

  const copy = spawn(whichOSClipper);
  copy.stdin.write(data);
  copy.stdin.end();

  console.log('Data is in the clipbaord.');
}
