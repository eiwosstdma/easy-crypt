/**
 *
 */
import {
  pbkdf2Sync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash
} from 'node:crypto';

/**
 *
 */
export function generateHash(str: string, alg?: string) {
  return createHash(alg ?? 'sha1').update('str').digest();
}

export function generatePassword(pass: string, salt: string, metadata: string, iteration?: number, length?: number): Buffer {
  const bufferPass = generateHash(pass, 'sha256');
  const bufferSalt = Buffer.from(salt, 'hex');
  const bufferMetadata = Buffer.from(metadata);
  return pbkdf2Sync(
    bufferPass,
    Buffer.concat([ bufferSalt, bufferMetadata ]),
    iteration ?? 10000,
    length ?? 16,
    'sha512'
  );
}

export function generateKey(password: string, salt: string, length: number) {
  return pbkdf2Sync(Buffer.from(password), Buffer.from(salt, 'hex'), 10000, length, 'sha256');
}

export function encrypt(content: string, password: string, userSalt: string) {
  const vector = randomBytes(16);
  const encryptSalt = randomBytes(16).toString('hex');
  const key = generateKey(password, userSalt + encryptSalt, 32);

  const cipher = createCipheriv('aes-256-cbc', key, vector);
  const encrypted = cipher.update(content, 'utf8');
  const result = Buffer.concat([ encrypted, cipher.final() ]);

  return {
    content: result.toString('hex'),
    iv: vector.toString('hex'),
    salt: encryptSalt
  };
}

export function decrypt(encryptedContent: string, password: string, userSalt: string, encryptSalt: string, vector: string) {
  const key = generateKey(password, userSalt + encryptSalt, 32);
  const iv = Buffer.from(vector, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = decipher.update(encryptedContent, 'hex');
  const result = Buffer.concat([ decrypted, decipher.final() ]);

  return result.toString('utf8');
}
