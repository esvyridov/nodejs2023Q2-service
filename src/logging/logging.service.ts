import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
    constructor() {
        const logLevels = (process.env.LOGGING_LEVELS ?? '').split(',').map((level: LogLevel) => level.trim()) as LogLevel[];

        super(undefined, {
            logLevels,
        });
    }

    log(message: string) {
        super.log(message);
    }

    error(message: string, stack?: string, context?: string) {
        if (typeof stack !== 'undefined') {
            if (typeof context !== 'undefined') {
                return super.error(message, stack, context);
            }
            
            return super.error(message, stack);
        }

        super.error(message);
    }

    warn(message: string) {
        super.warn(message);
    }

    debug(message: string) {
        super.debug(message);
    }

    verbose(message: string) {
        super.log(message);
    }
}
