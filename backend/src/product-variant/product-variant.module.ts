import { Module } from '@nestjs/common';
import { ProductVariantRepository } from './product-variant.repository';

@Module({
    exports: [ProductVariantRepository],
    providers: [ProductVariantRepository],
})
export class ProductVariantModule {}
