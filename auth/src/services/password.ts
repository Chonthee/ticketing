import {scrypt,randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password:string){
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password,salt,64)) as Buffer
        
        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword:string, supplidedPassword:string){
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(supplidedPassword,salt,64)) as Buffer
    
        return buf.toString('hex') === hashedPassword;
    }
}

// Result we want
// Password.toHash
// Password.toCompare
// if it's not static methode
// We have to use
// (new Password()).toHash()

// "Scrypt is 4000 times slower than BCrypt


