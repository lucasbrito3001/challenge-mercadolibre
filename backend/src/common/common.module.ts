import { Module, Global } from '@nestjs/common';
import { NestLoggerService } from './logger/nest-logger.service';

@Global()
@Module({
    providers: [
        {
            provide: 'LoggerService',
            useClass: NestLoggerService,
        },
    ],
    exports: ['LoggerService'],
})
export class CommonModule {}
