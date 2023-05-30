/**
 *
 */
import { join } from 'node:path';
import { homedir } from 'node:os';

/**
 *
 */

/**
 *
 */
import { addLog, args as parseARGS, generateUser, isPathValid, loadConfiguration } from './core/utils';
import config from './core/config';
import { dbConnection } from './core/db';
import help from './commands/help';
import error from './commands/error';
import use from './commands/use';
import { guardARGS } from './core/guards';
import { generatePassword } from './core/crypt';

/**
 *
 */
(async () => {
  try {
    config();
    const configuration = loadConfiguration();
    const db = dbConnection();
    const args = parseARGS();
    const validArgs = guardARGS(args);
    if (!validArgs)
      return console.error('Arguments are not valid.', 'Please, use \'--help\' for more informations.');


    if (args.help)
      return help();
    if (args.use)
      return await use(configuration, db, args.use, args.force ?? false, args.purge ?? false);
    else
      error();

    db.close();
  } catch(e) {
    console.error(e);
  }
})();
