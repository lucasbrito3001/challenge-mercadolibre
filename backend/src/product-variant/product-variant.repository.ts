import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import { Database, ProductVariant, ProductVariantImage } from 'src/db/type';

@Injectable()
export class ProductVariantRepository extends JsonRepository {
    constructor(
        @Inject('LoggerService')
        readonly logger: AppLogger,
    ) {
        super(logger);
    }

    async getBySlug(slug: string): Promise<ProductVariant> {
        let datasource: Database = await this.getDatasource();

        const variant = datasource.product_variant.find(
            (variant) => variant.slug === slug,
        );

        if (!variant) {
            this.logger.warn(
                `Variant with slug "${slug}" not found`,
                ProductVariantRepository.name,
            );
            throw new NotFoundException('Product variant not found');
        }

        this.logger.log(
            `Variant found: ${variant.sku}`,
            ProductVariantRepository.name,
        );
        return variant;
    }

    async getImages(variantId: number): Promise<ProductVariantImage[]> {
        let datasource: Database = await this.getDatasource();

        const images = datasource.product_variant_image.filter(
            (image) => image.variantId === variantId,
        );

        if (images.length === 0) {
            this.logger.warn(
                `Variant images with variantId "${variantId}" not found`,
                ProductVariantRepository.name,
            );
            throw new NotFoundException('Variant images not found');
        }

        this.logger.log(
            `Variant images found: ${images.length}`,
            ProductVariantRepository.name,
        );

        return images;
    }
}
