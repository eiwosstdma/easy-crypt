import { CustomErr } from '../core/types';

export class CustomError implements CustomErr{
  name!: string;
  created_at!: string;
  zone!: string;
  message!: string;
  content: any;

  constructor(name: string, zone: string, message: string) {
    this.name = name;
    this.zone = zone;
    this.message = message;
    this.created_at = new Date().toLocaleString();
  }

  stringifies(path: string) {
    this.message += path;

    let str = 'ERROR\n';
    str += this.name;
    str += '\n';
    str += this.created_at;
    str += '\n';
    str += this.zone;
    str += '\nMessage: ';
    str += this.message;
    str += '\nContent: ';
    str += JSON.stringify(this.content);

    return str;
  }
}
