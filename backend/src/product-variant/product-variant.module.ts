import { Module } from '@nestjs/common';
import { ProductVariantRepository } from './product-variant.repository';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';

@Module({
    exports: [ProductVariantRepository],
    providers: [ProductVariantRepository, ProductVariantService],
    controllers: [ProductVariantController],
})
export class ProductVariantModule {}
