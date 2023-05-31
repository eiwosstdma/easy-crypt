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
import set from './commands/set';
import get from './commands/get';
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
      help();
    else if (args.use)
      await use(configuration, db, args.use, args.force ?? false, args.purge ?? false);
    else if (args.set)
      await set(configuration, db, args.set, args.salt);
    else if (args.get)
      await get(configuration, db, args.get, args.noclip ?? false, args.purge ?? false, args.salt, args.output);
    else
      error();

    db.close();

    /**
     * Add the log for each used command
     */
    const commandAndFlags = Object.getOwnPropertyNames(args);
    const concatened = commandAndFlags.toLocaleString().replaceAll(',', ', ');
    addLog('Used commands and flags are: ' + (concatened.length === 0 ? 'none' : concatened));

  } catch(e) {
    console.error(e);
  }
})();
