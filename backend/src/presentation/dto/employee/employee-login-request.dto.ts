import { IsString, IsNotEmpty } from 'class-validator';

export class EmployeeLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
