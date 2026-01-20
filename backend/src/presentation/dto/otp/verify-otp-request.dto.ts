import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class VerifyOtpRequestDto {
  @IsString()
  @IsNotEmpty()
  otpId: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
