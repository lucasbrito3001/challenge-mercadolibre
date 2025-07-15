import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { OfferRepository } from 'src/offer/offer.repository';
import { ProductVariantRepository } from 'src/product-variant/product-variant.repository';
import { OptionRepository } from 'src/option/option.repository';
import { StoreRepository } from 'src/store/store.repository';
import { FeatureRepository } from 'src/feature/feature.repository';
import { ReviewRepository } from 'src/review/review.repository';

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        ProductRepository,
        ProductVariantRepository,
        OfferRepository,
        OptionRepository,
        StoreRepository,
        FeatureRepository,
        ReviewRepository
    ],
})
export class ProductModule {}
