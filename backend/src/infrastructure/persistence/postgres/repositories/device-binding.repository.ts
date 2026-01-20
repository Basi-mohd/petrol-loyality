import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceBindingOrmEntity } from '../entities/device-binding.orm-entity';

export interface IDeviceBindingRepository {
  save(phoneNumber: string, deviceId: string, deviceFingerprint?: string): Promise<void>;
  findByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<DeviceBindingOrmEntity | null>;
  isDeviceBound(phoneNumber: string, deviceId: string): Promise<boolean>;
  deactivateDevice(phoneNumber: string, deviceId: string): Promise<void>;
}

@Injectable()
export class DeviceBindingRepository implements IDeviceBindingRepository {
  constructor(
    @InjectRepository(DeviceBindingOrmEntity)
    private readonly ormRepository: Repository<DeviceBindingOrmEntity>,
  ) {}

  async save(phoneNumber: string, deviceId: string, deviceFingerprint?: string): Promise<void> {
    const existing = await this.findByPhoneAndDevice(phoneNumber, deviceId);
    if (existing) {
      existing.deviceFingerprint = deviceFingerprint || existing.deviceFingerprint;
      existing.isActive = true;
      existing.updatedAt = new Date();
      await this.ormRepository.save(existing);
    } else {
      const entity = new DeviceBindingOrmEntity();
      entity.id = this.generateId();
      entity.phoneNumber = phoneNumber;
      entity.deviceId = deviceId;
      entity.deviceFingerprint = deviceFingerprint || null;
      entity.isActive = true;
      await this.ormRepository.save(entity);
    }
  }

  async findByPhoneAndDevice(phoneNumber: string, deviceId: string): Promise<DeviceBindingOrmEntity | null> {
    return this.ormRepository.findOne({
      where: { phoneNumber, deviceId },
    });
  }

  async isDeviceBound(phoneNumber: string, deviceId: string): Promise<boolean> {
    const binding = await this.findByPhoneAndDevice(phoneNumber, deviceId);
    return binding !== null && binding.isActive;
  }

  async deactivateDevice(phoneNumber: string, deviceId: string): Promise<void> {
    await this.ormRepository.update(
      { phoneNumber, deviceId },
      { isActive: false, updatedAt: new Date() },
    );
  }

  private generateId(): string {
    const { v4: uuidv4 } = require('uuid');
    return uuidv4();
  }
}
