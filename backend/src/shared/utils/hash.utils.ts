import * as crypto from 'crypto';

export class HashUtils {
  static sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static createHashChain(previousHash: string, currentData: string): string {
    return this.sha256(`${previousHash}${currentData}`);
  }

  static generateId(): string {
    return crypto.randomUUID();
  }
}
