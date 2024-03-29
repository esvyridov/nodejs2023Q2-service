import { Injectable } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class UncaughtExceptionHandler {
  constructor(private readonly loggingService: LoggingService) {
    process.on('uncaughtException', this.handle.bind(this));
  }

  handle(reason: any) {
    this.loggingService.error('Uncaught Exception:' + reason);
  }
}