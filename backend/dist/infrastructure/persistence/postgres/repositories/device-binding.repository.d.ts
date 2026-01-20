import { Repository } from 'typeorm';
import { DeviceBindingOrmEntity } from '../entities/device-binding.orm-entity';
export interface IDeviceBindingRepository {
    save(phoneNumber: string, deviceId: string, deviceFingerprint?: string): Promise<void>;
    findByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<DeviceBindingOrmEntity | null>;
    isDeviceBound(phoneNumber: string, deviceId: string): Promise<boolean>;
    deactivateDevice(phoneNumber: string, deviceId: string): Promise<void>;
}
export declare class DeviceBindingRepository implements IDeviceBindingRepository {
    private readonly ormRepository;
    constructor(ormRepository: Repository<DeviceBindingOrmEntity>);
    save(phoneNumber: string, deviceId: string, deviceFingerprint?: string): Promise<void>;
    findByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<DeviceBindingOrmEntity | null>;
    isDeviceBound(phoneNumber: string, deviceId: string): Promise<boolean>;
    deactivateDevice(phoneNumber: string, deviceId: string): Promise<void>;
    private generateId;
}
