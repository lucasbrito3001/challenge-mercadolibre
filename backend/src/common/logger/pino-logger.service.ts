import { Injectable } from '@nestjs/common';
import { AppLogger } from './logger.interface';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PinoLoggerService implements AppLogger {
    constructor(private readonly logger: PinoLogger) {}

    log(message: string, context?: string) {
        this.logger.info(message, context);
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, context);
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, trace, context);
    }
}
