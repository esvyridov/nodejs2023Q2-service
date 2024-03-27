import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(context: string, private readonly loggingService: LoggingService) {
    this.loggingService.setContext(context);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();

    this.loggingService.log(`Received a Request: URL - ${req.url}; Body - ${JSON.stringify(req.body)}; Params - ${JSON.stringify(req.params)}; Query - ${JSON.stringify(req.query)}.`);

    return next
      .handle()
      .pipe(
        tap(() => {
            const res = ctx.getResponse();
            this.loggingService.log(`A response was send: Status Code - ${res.statusCode}.`);
        }),
      );
  }
}