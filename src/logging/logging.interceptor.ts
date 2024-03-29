import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(context: string, private readonly loggingService: LoggingService) {
    this.loggingService.setContext(context);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    this.loggingService.log(`Received a Request: URL - ${req.url}; Body - ${JSON.stringify(req.body)}; Params - ${JSON.stringify(req.params)}; Query - ${JSON.stringify(req.query)}.`);

    return next
      .handle()
      .pipe(
        tap(() => {
          this.loggingService.log(`A response was send: Status Code - ${res.statusCode}.`);
        }),
        catchError(err => {
          const httpStatus = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
          this.loggingService.error(`A response was send: Status Code - ${httpStatus}.`);
          return throwError(() => err);
        })
      );
  }
}