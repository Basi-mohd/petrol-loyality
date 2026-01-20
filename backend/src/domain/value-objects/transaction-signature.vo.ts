export class TransactionSignature {
  private constructor(
    private readonly signature: string,
    private readonly publicKey: string,
  ) {
    if (!signature || signature.trim().length === 0) {
      throw new Error('Signature cannot be empty');
    }
    if (!publicKey || publicKey.trim().length === 0) {
      throw new Error('Public key cannot be empty');
    }
  }

  static create(signature: string, publicKey: string): TransactionSignature {
    return new TransactionSignature(signature, publicKey);
  }

  getSignature(): string {
    return this.signature;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  equals(other: TransactionSignature): boolean {
    return (
      this.signature === other.signature &&
      this.publicKey === other.publicKey
    );
  }
}
