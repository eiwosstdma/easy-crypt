export interface Configuration {
  id: string;
  salt_1: string;
  salt_2: string;
}

export interface EncryptOutput {
  content: string;
  iv: string;
  salt: string;
}
