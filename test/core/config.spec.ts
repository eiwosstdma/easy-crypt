/**
 *
 */
import * as assert from 'node:assert';
import { join } from 'node:path';
import config from '../../src/core/config';
import { isPathValid } from '../../src/core/utils';
import { rmSync } from 'node:fs';
import { dbConnection } from '../../src/core/db';

/**
 *
 */
describe('Test configuration behavior', function() {
  const customPath = join(process.cwd(), 'easy-crypt-test');

  after('Clean customPathData', function() {
    rmSync(customPath, { force: true, recursive: true });
  });

  it('Should try if the custom path may exist before hand (expect false)', function() {
    assert.equal(isPathValid(customPath), false);
  });

  it('Should create a folder at a custom path', function() {
    config(customPath);
    assert.equal(isPathValid(customPath), true);
  });

  it('Check the sqlite instance', function() {
    const db = dbConnection(join(customPath, 'sqlite.db'));
    const tableNames = db.prepare('SELECT name FROM sqlite_master').all() as Array<{ name: string }>;
    db.close();

    assert.equal(tableNames[0].name, 'crypt_val');
    assert.equal(tableNames[1].name, 'users');
  });
});
