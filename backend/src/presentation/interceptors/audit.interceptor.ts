import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../infrastructure/audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject(AuditService)
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip } = request;

    return next.handle().pipe(
      tap(() => {
        if (user) {
          this.auditService.log(
            user.userId || user.id,
            user.role || 'UNKNOWN',
            method,
            url.split('?')[0],
            request.params?.id || 'N/A',
            {
              method,
              url,
              ip,
            },
            ip,
          );
        }
      }),
    );
  }
}
