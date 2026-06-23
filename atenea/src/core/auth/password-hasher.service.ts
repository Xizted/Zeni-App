import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class PasswordHasherService {
  private readonly dummyHash = this.hash('invalid-account-password');

  async hash(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  async verifyDummy(password: string): Promise<void> {
    await this.verify(await this.dummyHash, password);
  }
}
