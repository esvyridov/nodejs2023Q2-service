import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
    logRequest(url: string, body: any, queryParameters: any) {
        console.log({
            url,
            body,
            queryParameters,
        })
    }

    logResponse(statusCode: string) {
        console.log({
            statusCode,
        })
    }
}
