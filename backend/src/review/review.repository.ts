import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import { Database, Review, ReviewPhoto } from 'src/db/type';

export interface ReviewToOutput extends Review {
    photos: ReviewPhoto[];
}

@Injectable()
export class ReviewRepository extends JsonRepository {
    constructor(
        @Inject('LoggerService')
        readonly logger: AppLogger,
    ) {
        super(logger);
    }

    async getByVariantId(variantId: number): Promise<ReviewToOutput[]> {
        let datasource: Database = await this.getDatasource();

        const reviews = datasource.review.filter(
            (review) => review.variantId === variantId,
        );

        if (reviews.length === 0) {
            this.logger.warn(
                `Reviews with variantId "${variantId}" not found`,
                ReviewRepository.name,
            );

            return [];
        }

        this.logger.log(
            `Reviews found: ${reviews.length}`,
            ReviewRepository.name,
        );

        const reviewsWithPhotos = reviews.map((review) => {
            const reviewPhotos = datasource.review_photo.filter(
                (photo) => photo.reviewId === review.id,
            );

            return {
                ...review,
                photos: reviewPhotos,
            };
        });

        return reviewsWithPhotos;
    }
}
