export declare class PhoneNumber {
    private readonly value;
    private constructor();
    static create(value: string): PhoneNumber;
    getValue(): string;
    getCleaned(): string;
    equals(other: PhoneNumber): boolean;
}
