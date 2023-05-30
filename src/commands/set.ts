import { Database } from 'better-sqlite3';
import { Configuration } from '../core/types';
import { getUserHiddenInput, getUserPassword, handleError } from '../core/utils';
import { CustomError } from '../objs/CustomError';
import { guardUsers } from '../core/guards';
import { encrypt } from '../core/crypt';

export default async function(configuration: Configuration, db: Database, label: string, salt?: string) {
  let usableSalt = '';
  try {
    const labelTaken = db.prepare('SELECT * FROM crypt_val WHERE label = ?').get(label);
    if (labelTaken)
      return console.error('The label you\'ve used is already taken.');

    const defaultUser = db.prepare('SELECT ROWID, * FROM users WHERE default_user >= 1').get();
    const validUser = guardUsers(defaultUser);

    if (salt)
      usableSalt = salt;
    else if (!validUser)
      usableSalt = configuration.salt_1;
    else
      usableSalt = defaultUser.salt;

    const password = await getUserPassword();
    const input = await getUserHiddenInput();
    const encrypted = encrypt(input, password, usableSalt);

    const inserted = db
      .prepare('INSERT INTO crypt_val(label, content, salt, iv) VALUES(?, ?, ?, ?)')
      .run(label, encrypted.content, encrypted.salt, encrypted.iv);

    if (inserted.changes === 0)
      console.error('An error occurred, please retry again.', 'Your database (./easy-crypt/sqlite.db) may be corrupted.');
    else
      console.log(`A hidden value has been set under the label ${label}.`);
  } catch(e) {

    handleError(new CustomError(
      'Error in usage of \'use\' command',
      'An error occurred while using the use command, more details in the logs at ',
      (e as Error).stack as string,
      e
    ));
  }
}
