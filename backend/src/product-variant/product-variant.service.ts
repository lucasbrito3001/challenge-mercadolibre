import { Injectable } from '@nestjs/common';
import { ProductVariantRepository } from 'src/product-variant/product-variant.repository';
import { ProductVariant } from 'src/db/type';

@Injectable()
export class ProductVariantService {
    constructor(private readonly variantRepository: ProductVariantRepository) {}

    async findByOptions(
        options: { optionId: number; optionValueId: number }[],
    ): Promise<Pick<ProductVariant, 'id' | 'slug'>> {
        const variant = await this.variantRepository.findByOptions(options);

        return { id: variant.id, slug: variant.slug };
    }
}
