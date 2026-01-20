export class Employee {
  private constructor(
    public readonly id: string,
    public readonly employeeId: string,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    id: string,
    employeeId: string,
    passwordHash: string,
    name: string,
  ): Employee {
    const now = new Date();
    return new Employee(id, employeeId, passwordHash, name, true, now, now);
  }

  static reconstruct(
    id: string,
    employeeId: string,
    passwordHash: string,
    name: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Employee {
    return new Employee(
      id,
      employeeId,
      passwordHash,
      name,
      isActive,
      createdAt,
      updatedAt,
    );
  }

  deactivate(): Employee {
    return new Employee(
      this.id,
      this.employeeId,
      this.passwordHash,
      this.name,
      false,
      this.createdAt,
      new Date(),
    );
  }

  activate(): Employee {
    return new Employee(
      this.id,
      this.employeeId,
      this.passwordHash,
      this.name,
      true,
      this.createdAt,
      new Date(),
    );
  }

  updatePassword(passwordHash: string): Employee {
    return new Employee(
      this.id,
      this.employeeId,
      passwordHash,
      this.name,
      this.isActive,
      this.createdAt,
      new Date(),
    );
  }
}
