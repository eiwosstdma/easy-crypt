/**
 *
 */
import * as assert from 'node:assert';
import { decrypt, encrypt, generateKey } from '../../src/core/crypt';
import { guardEncryptOutput } from '../../src/core/guards';

/**
 *
 */
describe('Test all crypt functions', function() {
  const e: Array<any | unknown> = [];

  it('Test key length and output', function() {
    const key_1 = generateKey('123123', 'aabbcc', 16).toString('hex');
    const key_2 = generateKey('123123', 'aabbcc', 16).toString('hex');
    const key_3 = generateKey('123123', 'aabbcc', 24).toString('hex');
    const key_4 = generateKey('12312789456611', 'aabbcc', 16).toString('hex');

    assert.equal(key_1.length, 32);
    assert.equal(key_3.length, 48);
    assert.equal(key_1, key_2);
    assert.notEqual(key_1, key_3);
    assert.notEqual(key_1, key_4);
    assert.notEqual(key_3, key_4);
  });

  it('Test encryption', function() {
    const message = 'HELLO WORLD';
    const password = '123123';
    const salt = '456789';

    const encrypted = encrypt(message, password, salt);
    e.push(encrypted);

    assert.equal(typeof encrypted.content, 'string');
    assert.equal(typeof encrypted.iv, 'string');
    assert.equal(typeof encrypted.salt, 'string');
  });

  it('test decryption', function() {
    const obj = e[0];
    const isValid = guardEncryptOutput(obj);

    if (isValid) {
      const decrypted = decrypt(obj.content, '123123', '456789', obj.salt, obj.iv);

      assert.equal(decrypted, 'HELLO WORLD');
    } else {
      assert.equal(true, false);
    }
  });
});
