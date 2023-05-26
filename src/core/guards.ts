import { Configuration, EncryptOutput } from './types';

export function guardConfiguration(obj: any): obj is Configuration {
  return (
    obj !== null &&
    obj !== undefined &&
    obj instanceof Object &&
    typeof obj.id === 'string' &&
    (typeof obj.salt_1 === 'string' && obj.salt_1.length === 32) &&
    (typeof obj.salt_2 === 'string' && obj.salt_2.length === 32)
  );
}

export function guardEncryptOutput(obj: any): obj is EncryptOutput {
  return (
    obj !== null &&
    obj !== undefined &&
    obj instanceof Object &&
    typeof obj.content === 'string' &&
    typeof obj.iv === 'string' &&
    typeof obj.salt === 'string'
  );
}
