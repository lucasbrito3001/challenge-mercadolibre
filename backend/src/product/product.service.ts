import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductVariantRepository } from 'src/product-variant/product-variant.repository';
import { FeatureOutputDto, OptionsOutputDto, ProductOutputDto, VariantOptionOutputDto, VariantOutputDto } from './dto/get-product.dto';
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

        const [product, images, offer, variantOptions] = await Promise.all([
            await this.productRepository.getById(variant.productId),
            await this.variantRepository.getImages(variant.id),
            await this.offerRepository.getActiveOfferBySlug(variant.id),
            await this.variantRepository.getOptionValues(variant.id),
        ])

        const [store, options, features, variants] = await Promise.all([
            await this.storeRepository.getById(product.storeId),
            await this.optionRepository.getAllByProductId(product.id),
            await this.featureRepository.getAllByProductId(product.id),
            await this.variantRepository.getVariantsWithOptionsByProductId(product.id),
        ])

        const imageUrlList: string[] = images.map((image) => image.url)
        const optionsOutput: OptionsOutputDto[] = options.map((option) => ({
            value: option.value,
            id: option.id,
            optionValues: option.optionValues.map((optionValue) => ({
                value: optionValue.value,
                imageUrl: optionValue.imageUrl,
                id: optionValue.id,
                optionId: optionValue.optionId,
            })),
        }))
        const featuresOutput: FeatureOutputDto[] = features.map((feature) => ({
            key: feature.key,
            value: feature.value,
            iconUrl: feature.iconUrl,
        }))
        const variantOptionsOutput: VariantOptionOutputDto[] = variantOptions.map((variantOption) => ({
            optionId: variantOption.optionId,
            optionValueId: variantOption.optionValueId,
        }))
        const variantsOutput: VariantOutputDto[] = variants.map((variant) => ({
            id: variant.id,
            slug: variant.slug,
            stock: variant.stock,
            optionValues: variant.optionValues.map((optionValue) => ({
                optionId: optionValue.optionId,
                optionValueId: optionValue.optionValueId,
            })),
        }))

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
            imageUrlList: imageUrlList,
            offer: offer ? { price: offer.offerPrice } : null,
            options: optionsOutput,
            features: featuresOutput,
            variantOptions: variantOptionsOutput,
            variants: variantsOutput,
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
        };
    }
}
