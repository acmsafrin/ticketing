import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const pscryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await pscryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashPassword, salt] = storedPassword.split('.');
    const buf = (await pscryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return hashPassword === buf.toString('hex');
  }
}
