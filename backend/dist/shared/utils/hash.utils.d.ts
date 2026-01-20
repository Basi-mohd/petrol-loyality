export declare class HashUtils {
    static sha256(data: string): string;
    static createHashChain(previousHash: string, currentData: string): string;
    static generateId(): string;
}
