import { Repository } from 'typeorm';
import { Otp } from '../../../../domain/entities/otp.entity';
import { OtpOrmEntity } from '../entities/otp.orm-entity';
export interface IOtpRepository {
    save(otp: Otp): Promise<void>;
    findById(id: string): Promise<Otp | null>;
    findLatestByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<Otp | null>;
    findRecentByPhone(phoneNumber: string, minutes: number): Promise<Otp[]>;
    deleteExpired(): Promise<void>;
}
export declare class OtpRepository implements IOtpRepository {
    private readonly ormRepository;
    constructor(ormRepository: Repository<OtpOrmEntity>);
    save(otp: Otp): Promise<void>;
    findById(id: string): Promise<Otp | null>;
    findLatestByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<Otp | null>;
    findRecentByPhone(phoneNumber: string, minutes: number): Promise<Otp[]>;
    deleteExpired(): Promise<void>;
    private toOrmEntity;
    private toDomainEntity;
}
