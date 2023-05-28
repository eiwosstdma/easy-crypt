import { Configuration, CustomErr } from '../core/types';
import { Database } from 'better-sqlite3';
import { guardUsers } from '../core/guards';
import { generateUser, getUserPassword, handleError } from '../core/utils';

export default async function(configuration: Configuration, db: Database, name: string, force: boolean) {
  try {
    if (!force) {
      const user = db.prepare('SELECT * FROM users WHERE name = ?').get(name);
      const validUser = guardUsers(user);

      if (!validUser)
        console.error(`There is no user with the name ${name}.`);
      else {
        db.prepare('UPDATE users SET default = 1 WHERE name = ?').run();
        console.log(`User ${name} is now the default user.`);
      }
    } else {
      const user = db.prepare('SELECT * FROM users WHERE name = ?').get(name);
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
    const err: CustomErr = {
      zone: 'command_use',
      created_at: new Date().toLocaleString(),
      message: 'An error occurred in use command',
      content: JSON.stringify(e)
    };

    console.error(err.message);
    handleError(err);

    process.exit(1);
  }
}
