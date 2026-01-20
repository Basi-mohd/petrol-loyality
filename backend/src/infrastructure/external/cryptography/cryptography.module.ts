import { Module } from '@nestjs/common';
import { SignatureVerificationService } from './signature-verification.service';

@Module({
  providers: [
    SignatureVerificationService,
    {
      provide: 'ISignatureVerificationService',
      useClass: SignatureVerificationService,
    },
  ],
  exports: [SignatureVerificationService, 'ISignatureVerificationService'],
})
export class CryptographyModule {}
