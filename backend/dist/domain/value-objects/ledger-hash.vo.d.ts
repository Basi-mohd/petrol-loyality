export declare class LedgerHash {
    private readonly value;
    private constructor();
    static create(value: string): LedgerHash;
    getValue(): string;
    equals(other: LedgerHash): boolean;
}
