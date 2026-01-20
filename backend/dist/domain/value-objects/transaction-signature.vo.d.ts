export declare class TransactionSignature {
    private readonly signature;
    private readonly publicKey;
    private constructor();
    static create(signature: string, publicKey: string): TransactionSignature;
    getSignature(): string;
    getPublicKey(): string;
    equals(other: TransactionSignature): boolean;
}
