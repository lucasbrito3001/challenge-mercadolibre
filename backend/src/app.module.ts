import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductModule } from './product/product.module';
import { NestLoggerService } from './common/logger/nest-logger.service';
import { CommonModule } from './common/common.module';

@Module({
    imports: [ProductModule, CommonModule],
    controllers: [AppController],
    providers: [
        {
            provide: 'LoggerService',
            useClass: NestLoggerService,
        },
    ],
    exports: ['LoggerService'],
})
export class AppModule {}
