import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import { Database, ProductFeature } from 'src/db/type';

@Injectable()
export class FeatureRepository extends JsonRepository {
    constructor(
        @Inject('LoggerService')
        readonly logger: AppLogger,
    ) {
        super(logger);
    }

    async getAllByProductId(productId: number): Promise<ProductFeature[]> {
        let datasource: Database = await this.getDatasource();

        const features = datasource.product_feature.filter(
            (feature) => feature.productId === productId,
        );

        if (features.length === 0) {
            this.logger.warn(
                `Feature with productId "${productId}" not found`,
                FeatureRepository.name,
            );

            throw new NotFoundException('Feature not found');
        }

        this.logger.log(
            `Features found: ${features.length}`,
            FeatureRepository.name,
        );

        return features;
    }
}
