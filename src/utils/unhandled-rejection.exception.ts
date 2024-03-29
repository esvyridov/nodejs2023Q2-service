import { Injectable } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class UnhandledRejectionHandler {
  constructor(private readonly loggingService: LoggingService) {
    process.on('unhandledRejection', this.handle.bind(this));
  }

  handle(reason: any) {
    const message = reason instanceof Error ? reason.message : reason;

    this.loggingService.error('Unhandled Rejection: ' + message);
  }
}