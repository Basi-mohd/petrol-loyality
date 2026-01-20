export declare class Amount {
    private readonly value;
    private constructor();
    static create(value: number): Amount;
    getValue(): number;
    add(other: Amount): Amount;
    subtract(other: Amount): Amount;
    equals(other: Amount): boolean;
    isGreaterThan(other: Amount): boolean;
}
