import { UserRole } from '../enums/user-role.enum';

export class Admin {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(id: string, email: string, name: string): Admin {
    const now = new Date();
    return new Admin(id, email, name, true, now, now);
  }

  static reconstruct(
    id: string,
    email: string,
    name: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Admin {
    return new Admin(id, email, name, isActive, createdAt, updatedAt);
  }
}
