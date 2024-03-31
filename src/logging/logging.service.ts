import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { appendFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const logLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];
const logLevel = parseInt(process.env.LOGGING_LEVEL, 10);
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  day: '2-digit',
  month: '2-digit',
});

@Injectable()
export class LoggingService extends ConsoleLogger {
  logLevels = logLevels.slice(0, isNaN(logLevel) ? logLevels.length : logLevel);
  logFileIndex = 1;
  errorFileIndex = 1;
  maxLogFileSize = 1024 * (isNaN(parseInt(process.env.LOG_FILE_SIZE_KB, 10)) ? parseInt(process.env.LOG_FILE_SIZE_KB, 10) : 128); 
  maxErrorFileSize = 1024 * (isNaN(parseInt(process.env.ERROR_FILE_SIZE_KB, 10)) ? parseInt(process.env.ERROR_FILE_SIZE_KB, 10) : 128);

  getLogFilePath() {
    return resolve(__dirname, `../../logs/logs_${this.logFileIndex}.log`);
  }

  getErrorFilePath() {
    return resolve(__dirname, `../../logs/errors_${this.errorFileIndex}.log`);
  }

  async rotateLogFile() {
    const { size } = await stat(this.getLogFilePath());

    if (size >= this.maxLogFileSize) {
      this.logFileIndex++;
    }
  }

  async rotateErrorFile() {
    const { size } = await stat(this.getErrorFilePath());

    if (size >= this.maxLogFileSize) {
      this.logFileIndex++;
    }
  }

  async writeLog(path: string, message: string) {
    await appendFile(path, message + '\n');
  }

  formatFileMessage(message: string, logLevel: LogLevel) {
    return `${dateTimeFormatter.format(Date.now())} ${logLevel.toUpperCase()} ${message}`;
  }

  async log(message: string) {
    if (!this.logLevels.includes('log')) {
      return;
    }
    
    await this.writeLog(this.getLogFilePath(), this.formatFileMessage(message, 'log'));
    await this.rotateLogFile();
    
    super.log(message);
  }

  async error(message: string) {
    if (!this.logLevels.includes('error')) {
      return;
    }

    await this.writeLog(this.getErrorFilePath(), this.formatFileMessage(message, 'error'));
    await this.rotateErrorFile();

    super.error(message);
  }

  async warn(message: string) {
    if (!this.logLevels.includes('warn')) {
      return;
    }

    await this.writeLog(this.getLogFilePath(), this.formatFileMessage(message, 'warn'));
    await this.rotateLogFile();
    super.warn(message);
  }

  async debug(message: string) {
    if (!this.logLevels.includes('debug')) {
      return;
    }

    await this.writeLog(this.getLogFilePath(), this.formatFileMessage(message, 'debug'));
    await this.rotateLogFile();
    super.debug(message);
  }

  async verbose(message: string) {
    if (!this.logLevels.includes('verbose')) {
      return;
    }

    await this.writeLog(this.getLogFilePath(), this.formatFileMessage(message, 'verbose'));
    await this.rotateLogFile();
    super.log(message);
  }
}
