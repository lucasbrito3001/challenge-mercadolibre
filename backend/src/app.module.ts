import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductModule } from './product/product.module';
import { PinoLoggerService } from './common/logger/pino-logger.service';
import { CommonModule } from './common/common.module';
import { ProductVariantModule } from './product-variant/product-variant.module';

@Module({
    imports: [
        CommonModule,
        ProductModule,
        ProductVariantModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: 'LoggerService',
            useClass: PinoLoggerService,
        },
    ],
    exports: ['LoggerService'],
})
export class AppModule {}
