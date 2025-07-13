import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductVariantRepository } from 'src/product-variant/product-variant.repository';
import { ProductOutputDto, VariantsOutputDto } from './dto/get-product.dto';
import { OfferRepository } from 'src/offer/offer.repository';
import { OptionRepository } from 'src/option/option.repository';
import { StoreRepository } from 'src/store/store.repository';
import { FeatureRepository } from 'src/feature/feature.repository';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly variantRepository: ProductVariantRepository,
        private readonly offerRepository: OfferRepository,
        private readonly optionRepository: OptionRepository,
        private readonly storeRepository: StoreRepository,
        private readonly featureRepository: FeatureRepository,
    ) {}

    async findBySlug(slug: string): Promise<ProductOutputDto> {
        const variant = await this.variantRepository.getBySlug(slug);
        const images = await this.variantRepository.getImages(variant.id);
        const product = await this.productRepository.getById(variant.productId);
        const store = await this.storeRepository.getById(product.storeId);
        const offer = await this.offerRepository.getActiveOfferBySlug(
            variant.id,
        );
        const options = await this.optionRepository.getAllByProductId(
            product.id,
        );
        const features = await this.featureRepository.getAllByProductId(
            product.id,
        );

        return {
            description: product.description,
            price: variant.price,
            quantity: variant.stock,
            quantitySold: product.quantitySold,
            rating: product.rating,
            reviewCount: product.reviewCount,
            sku: variant.sku,
            slug: variant.slug,
            title: product.name,
            imageUrlList: images.map((image) => image.url),
            offer: offer ? { price: offer.offerPrice } : null,
            store: {
                salesNumber: store.salesNumber,
                productsNumber: store.productsNumber,
                isOfficial: store.isOfficial,
                iconUrl: store.iconUrl,
                name: store.name,
                isPositiveService: store.isPositiveService,
                isOnTimeDelivery: store.isOnTimeDelivery,
                bannerUrl: store.bannerUrl,
            },
            options: options,
            features: features.map((feature) => ({
                key: feature.key,
                value: feature.value,
                iconUrl: feature.iconUrl,
            })),
        };
    }
}
