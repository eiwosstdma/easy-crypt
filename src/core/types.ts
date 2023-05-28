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

export interface Crypt_Value {
  rowid: number;
  created_at: string;
  label: string;
  content: string;
  salt: string;
  iv: string;
}

export interface Users {
  rowid: number;
  created_at: string;
  uuid: string;
  name: string;
  salt: string;
  pass: string;
}

export interface CustomErr {
  created_at: string;
  zone: string;
  message: string;
  content: any;
}
