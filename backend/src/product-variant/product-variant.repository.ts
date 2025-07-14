import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import {
    Database,
    ProductVariant,
    ProductVariantImage,
    ProductVariantOptionValue,
} from 'src/db/type';

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

    async getVariantsWithOptionsByProductId(
        productId: number,
    ): Promise<
        (ProductVariant & { optionValues: ProductVariantOptionValue[] })[]
    > {
        const datasource: Database = await this.getDatasource();

        const variants = datasource.product_variant.filter(
            (variant) => variant.productId === productId,
        );

        const variantsWithOptions = variants.map((variant) => {
            const optionValues = datasource.product_variant_option_value.filter(
                (optValue) => optValue.variantId === variant.id,
            );

            return {
                ...variant,
                optionValues,
            };
        });

        if (variantsWithOptions.length === 0) {
            this.logger.warn(
                `No variants found for productId "${productId}"`,
                ProductVariantRepository.name,
            );
            throw new NotFoundException(
                `No variants found for productId "${productId}"`,
            );
        }

        this.logger.log(
            `Found ${variantsWithOptions.length} variants with options for productId "${productId}"`,
            ProductVariantRepository.name,
        );

        return variantsWithOptions;
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

    async getOptionValues(
        variantId: number,
    ): Promise<ProductVariantOptionValue[]> {
        let datasource: Database = await this.getDatasource();

        const optionValues = datasource.product_variant_option_value.filter(
            (optionValue) => optionValue.variantId === variantId,
        );

        if (optionValues.length === 0) {
            this.logger.warn(
                `Variant option values with variantId "${variantId}" not found`,
                ProductVariantRepository.name,
            );
            throw new NotFoundException('Variant option values not found');
        }

        this.logger.log(
            `Variant option values found: ${optionValues.length}`,
            ProductVariantRepository.name,
        );

        return optionValues;
    }

    async findByOptions(
        options: { optionId: number; optionValueId: number }[],
    ): Promise<ProductVariant> {
        const datasource: Database = await this.getDatasource();

        const variants = datasource.product_variant;

        for (const variant of variants) {
            const variantOptions =
                datasource.product_variant_option_value.filter(
                    (vo) => vo.variantId === variant.id,
                );

            const isMatch = options.every((inputOpt) =>
                variantOptions.some(
                    (vo) =>
                        vo.optionId === inputOpt.optionId &&
                        vo.optionValueId === inputOpt.optionValueId,
                ),
            );

            if (isMatch && variantOptions.length === options.length) {
                this.logger.log(
                    `Variant found by options: ${variant.sku}`,
                    ProductVariantRepository.name,
                );

                return variant;
            }
        }

        this.logger.warn(
            `No variant matches options: ${JSON.stringify(options)}`,
            ProductVariantRepository.name,
        );
        throw new NotFoundException('Variant not found for provided options');
    }
}
