import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import { Database, Offer, OfferStatuses } from 'src/db/type';

@Injectable()
export class OfferRepository extends JsonRepository {
    constructor(
        @Inject('LoggerService')
        readonly logger: AppLogger,
    ) {
        super(logger);
    }

    async getActiveOfferBySlug(
        productVariantId: number,
    ): Promise<Offer | null> {
        let datasource: Database = await this.getDatasource();

        const offer = datasource.offer.find(
            (offer) =>
                offer.productVariantId === productVariantId &&
                offer.status === OfferStatuses.Active,
        );

        if (!offer) {
            this.logger.warn(
                `Active offer with productVariantId "${productVariantId}" not found`,
                OfferRepository.name,
            );

            return null;
        }

        this.logger.log(
            `Active offer found with productVariantId: ${productVariantId}`,
            OfferRepository.name,
        );

        return offer;
    }
}
