import { IsString, IsNumber, IsEnum, IsOptional, IsObject } from 'class-validator';

export class CreateTransactionRequestDto {
  @IsString()
  customerId: string;

  @IsNumber()
  amount: number;

  @IsEnum(['CREDIT', 'DEBIT', 'REFUND'])
  type: 'CREDIT' | 'DEBIT' | 'REFUND';

  @IsString()
  signature: string;

  @IsString()
  publicKey: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
