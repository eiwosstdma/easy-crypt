/**
 *
 */
import * as assert from 'node:assert';
import { join } from 'node:path';
import config from '../../src/core/config';
import { isPathValid } from '../../src/core/utils';
import { rmSync } from 'node:fs';

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
});
