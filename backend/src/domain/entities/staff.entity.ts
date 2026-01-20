import { UserRole } from '../enums/user-role.enum';

export class Staff {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    email: string,
    name: string,
    role: UserRole = UserRole.STAFF,
  ): Staff {
    const now = new Date();
    return new Staff(id, email, name, role, true, now, now);
  }

  static reconstruct(
    id: string,
    email: string,
    name: string,
    role: UserRole,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Staff {
    return new Staff(id, email, name, role, isActive, createdAt, updatedAt);
  }

  deactivate(): Staff {
    return new Staff(
      this.id,
      this.email,
      this.name,
      this.role,
      false,
      this.createdAt,
      new Date(),
    );
  }

  activate(): Staff {
    return new Staff(
      this.id,
      this.email,
      this.name,
      this.role,
      true,
      this.createdAt,
      new Date(),
    );
  }
}
