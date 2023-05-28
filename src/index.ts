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
import { addLog, args as parseARGS, isPathValid, loadConfiguration } from './core/utils';
import config from './core/config';
import { dbConnection } from './core/db';
import help from './commands/help';
import error from './commands/error';
import use from './commands/use';

/**
 *
 */
(async () => {
  try {
    config();
    const configuration = loadConfiguration();
    const db = dbConnection();
    const args = parseARGS();

    if (args.help)
      help();
    if (args.use)
      use(configuration, db, typeof args.use === 'string' ? args.use : 'root', args.force === false ? false : true);
    else
      error();

    db.close();
  } catch(e) {
    console.error(e);
  }
})();
