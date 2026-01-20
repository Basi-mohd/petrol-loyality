import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { DomainException } from '../../domain/exceptions/domain-exception';
export declare class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainException, host: ArgumentsHost): void;
}
