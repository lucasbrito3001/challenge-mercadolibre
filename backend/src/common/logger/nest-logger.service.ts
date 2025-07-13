import { Injectable, Logger } from '@nestjs/common';
import { AppLogger } from './logger.interface';

@Injectable()
export class NestLoggerService implements AppLogger {
  private readonly logger = new Logger();

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug?.(message, context);
  }
}
