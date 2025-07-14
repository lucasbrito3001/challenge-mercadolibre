import { Module, Global } from '@nestjs/common';
import { PinoLoggerService } from './logger/pino-logger.service';
import { LoggerModule } from 'nestjs-pino';

const isDev = process.env.NODE_ENV !== 'production';

@Global()
@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                level: 'info',
            },
        }),
    ],
    providers: [
        {
            provide: 'LoggerService',
            useClass: PinoLoggerService,
        },
    ],
    exports: ['LoggerService'],
})
export class CommonModule {}
