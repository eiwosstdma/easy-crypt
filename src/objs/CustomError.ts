import { CustomErr } from '../core/types';

export class CustomError implements CustomErr {
  name!: string;
  created_at = new Date();
  message!: string;
  content: any;
  metadata?: any;

  constructor(name: string, message: string, stack: string, metadata?: any) {
    this.name = name;
    this.message = message;
    this.content = stack;
    this.metadata = metadata;
  }

  stringifies(path: string) {
    const delimiter = '\n___ ___ ___ ___ ___ ___ ___ ___';

    /**
     * Adding the filePath to the message (when displayed)
     */
    this.message += path;

    let str = 'ERROR: ';
    str += this.name + delimiter;
    str += '\nCreated_at: ';
    str += this.created_at.toLocaleString() + delimiter;
    str += '\nMessage: ';
    str += this.message + delimiter;
    str += '\nStack: \n';
    str += this.content + delimiter;

    if (this.metadata)
      str += '\n\n\nOriginal content: \n' + JSON.stringify(this.metadata);
    else
      str += '\n\n\nOriginal content: No original data has been found.';


    return str;
  }
}
