import { IsString, IsOptional, IsEmail } from 'class-validator';

export class LoginRequestDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  password: string;
}
