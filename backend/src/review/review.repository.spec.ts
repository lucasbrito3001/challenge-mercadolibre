import { Test, TestingModule } from '@nestjs/testing';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import { Database, Review, ReviewPhoto } from 'src/db/type';
import { ReviewRepository } from './review.repository';

describe('ReviewRepository', () => {
    let repository: ReviewRepository;
    let logger: AppLogger;
    let getDatasourceSpy;

    const mockLogger = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    };

    const mockDatabase: Database = {
        review: [
            { id: 1, variantId: 101, rating: 5, comment: 'Great product!' },
            { id: 2, variantId: 101, rating: 4, comment: 'Very good.' },
            { id: 3, variantId: 102, rating: 3, comment: 'Average.' },
            { id: 4, variantId: 101, rating: 5, comment: 'Excellent!' },
            { id: 5, variantId: 103, rating: 1, comment: 'Bad experience.' },
        ],
        review_photo: [
            { reviewId: 1, url: 'http://example.com/photo1_1.jpg' },
            { reviewId: 1, url: 'http://example.com/photo1_2.jpg' },
            { reviewId: 2, url: 'http://example.com/photo2_1.jpg' },
            { reviewId: 4, url: 'http://example.com/photo4_1.jpg' },
        ],

        product: [],
        product_feature: [],
        product_option: [],
        product_option_value: [],
        offer: [],
        store: [],
        product_variant: [],
        product_variant_image: [],
        product_variant_option_value: [],
    };

    const mockDatabaseNoReviews: Database = {
        ...mockDatabase,
        review: [],
    };

    const mockDatabaseReviewsNoPhotos: Database = {
        ...mockDatabase,
        review_photo: [],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewRepository,
                {
                    provide: 'LoggerService',
                    useValue: mockLogger,
                },
            ],
        }).compile();

        repository = module.get<ReviewRepository>(ReviewRepository);
        logger = module.get<AppLogger>('LoggerService');

        getDatasourceSpy = jest.spyOn(repository, 'getDatasource');

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('getByVariantId', () => {
        it('should return reviews with photos for a valid variantId', async () => {
            const variantId = 101;
            getDatasourceSpy.mockResolvedValue(mockDatabase);

            const result = await repository.getByVariantId(variantId);

            expect(getDatasourceSpy).toHaveBeenCalled();
            expect(result.length).toBe(3);
            expect(result[0].id).toBe(1);
            expect(result[0].photos.length).toBe(2);
            expect(result[0].photos[0].url).toBe(
                'http://example.com/photo1_1.jpg',
            );
            expect(result[1].id).toBe(2);
            expect(result[1].photos.length).toBe(1);
            expect(result[2].id).toBe(4);
            expect(result[2].photos.length).toBe(1);
            expect(logger.log).toHaveBeenCalledWith(
                `Reviews found: 3`,
                ReviewRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should return reviews without photos if no photos are associated', async () => {
            const variantId = 102;
            getDatasourceSpy.mockResolvedValue(mockDatabaseReviewsNoPhotos);

            const result = await repository.getByVariantId(variantId);

            expect(getDatasourceSpy).toHaveBeenCalled();
            expect(result.length).toBe(1);
            expect(result[0].id).toBe(3);
            expect(result[0].photos).toEqual([]);
            expect(logger.log).toHaveBeenCalledWith(
                `Reviews found: 1`,
                ReviewRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should return an empty array if no reviews are found for the variantId', async () => {
            const variantId = 999;
            getDatasourceSpy.mockResolvedValue(mockDatabase);

            const result = await repository.getByVariantId(variantId);

            expect(getDatasourceSpy).toHaveBeenCalled();
            expect(result).toEqual([]);
            expect(logger.warn).toHaveBeenCalledWith(
                `Reviews with variantId "${variantId}" not found`,
                ReviewRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should return an empty array if the database reviews array is empty', async () => {
            const variantId = 101;
            getDatasourceSpy.mockResolvedValue(mockDatabaseNoReviews);

            const result = await repository.getByVariantId(variantId);

            expect(getDatasourceSpy).toHaveBeenCalled();
            expect(result).toEqual([]);
            expect(logger.warn).toHaveBeenCalledWith(
                `Reviews with variantId "${variantId}" not found`,
                ReviewRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors thrown by getDatasource', async () => {
            const variantId = 101;
            const errorMessage = 'Failed to load database';
            getDatasourceSpy.mockRejectedValue(new Error(errorMessage));

            await expect(repository.getByVariantId(variantId)).rejects.toThrow(
                errorMessage,
            );
            expect(getDatasourceSpy).toHaveBeenCalled();
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });
});
