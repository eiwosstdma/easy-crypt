import { Configuration, CustomErr, Users } from '../core/types';
import { Database } from 'better-sqlite3';
import { guardUsers } from '../core/guards';
import { generateUser, getUserPassword, handleError } from '../core/utils';
import { CustomError } from '../objs/CustomError';
import { comparePassword } from '../core/crypt';

export default async function(configuration: Configuration, db: Database, name: string, force: boolean, purge: boolean) {
  try {
    if (purge) {
      const user = db.prepare('SELECT ROWID, * FROM users WHERE name = ?').get(name) as Users;
      const validUser = guardUsers(user ?? {});

      if (!validUser)
        return console.error(`There is no user with name ${name} to delete.`);

      const password = await getUserPassword();
      const comparedPassword = comparePassword(password, user);

      if (comparedPassword) {
        const res = db.prepare('DELETE FROM users WHERE name = ?').run(name);

        if (res.changes === 0)
          console.error('An unknown error occurred with the database, please retry.');
        else
          console.log(`User with name ${name} has been deleted.`);

      } else
        return console.error(`Password for user ${name} is not valid.`);
    }

    if (!force && !purge) {
      const user = db.prepare('SELECT ROWID, * FROM users WHERE name = ?').get(name) as Users;

      const validUser = guardUsers(user ?? {});

      if (!validUser)
        console.error(`There is no user with the name ${name}.`);
      else if (user.default_user !== 0)
        console.error(`User ${name} is already the default user.`);
      else {
        db.prepare('UPDATE users SET default_user = 1 WHERE name = ?').run(name);
        console.log(`User ${name} is now the default user.`);
      }
    }

    if (force && !purge) {
      const user = db.prepare('SELECT ROWID, * FROM users WHERE name = ?').get(name) as Users;
      const validUser = guardUsers(user);

      if (validUser)
        console.error(`A user with name ${name} already exists.`);
      else {
        const password = await getUserPassword();
        const newUser = generateUser(name, password);
        const inserted = db
          .prepare('INSERT INTO users(uuid, name, salt, pass) VALUES(?, ?, ?, ?)')
          .run(
            newUser.uuid,
            newUser.name,
            newUser.salt,
            newUser.pass
          );

        if (inserted.changes !== 0)
          console.log('A new user has been created with name ' + name);
        else
          console.error('Cannot generate a new user for an unknown reason.\nPlease, check the integrity of the database named "sqlite.db" in the easy-crypt folder.');
      }
    }

  } catch(e) {

    handleError(new CustomError(
      'Error in usage of \'use\' command',
      'An error occurred while using the use command, more details in the logs at ',
      (e as Error).stack as string,
      e
    ));
  }
}
