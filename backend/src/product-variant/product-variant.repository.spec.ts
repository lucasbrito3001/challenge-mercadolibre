import { Test, TestingModule } from '@nestjs/testing';
import {
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ProductVariantRepository } from './product-variant.repository';
import { AppLogger } from 'src/common/logger/logger.interface';
import { Database } from 'src/db/type';
import { mockDatabaseEmpty, mockDatabase } from 'src/mock';

describe('ProductVariantRepository', () => {
    let repository: ProductVariantRepository;
    let logger: AppLogger;
    let getDatasourceSpy: jest.SpyInstance;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductVariantRepository,
                {
                    provide: 'LoggerService',
                    useValue: {
                        log: jest.fn(),
                        warn: jest.fn(),
                        error: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<ProductVariantRepository>(
            ProductVariantRepository,
        );
        logger = module.get<AppLogger>('LoggerService');
        getDatasourceSpy = jest.spyOn(repository, 'getDatasource');

        getDatasourceSpy.mockReset();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('getBySlug', () => {
        it('should return a product variant when a valid slug is provided', async () => {
            getDatasourceSpy.mockResolvedValueOnce(mockDatabase);

            const slug = mockDatabase.product_variant[0].slug;
            const result = await repository.getBySlug(slug);

            expect(getDatasourceSpy).toHaveBeenCalledTimes(1);

            expect(logger.log).toHaveBeenCalledWith(
                `Variant found: ${mockDatabase.product_variant[0].sku}`,
                ProductVariantRepository.name,
            );

            expect(result).toEqual(mockDatabase.product_variant[0]);
        });

        it('should throw NotFoundException if the product variant is not found', async () => {
            getDatasourceSpy.mockResolvedValueOnce(mockDatabase);

            const slug = 'non-existent-slug';

            const rejection = await expect(repository.getBySlug(slug)).rejects;

            rejection.toThrow(NotFoundException);
            rejection.toHaveProperty('message', 'Product variant not found');

            expect(getDatasourceSpy).toHaveBeenCalledTimes(1);

            expect(logger.warn).toHaveBeenCalledWith(
                `Variant with slug "${slug}" not found`,
                ProductVariantRepository.name,
            );
        });

        it('should re-throw InternalServerErrorException if getDatasource fails', async () => {
            const mockGetDatasourceError = new InternalServerErrorException(
                'Failed to access the datasource',
            );
            getDatasourceSpy.mockRejectedValueOnce(mockGetDatasourceError);

            const slug = 'any-slug';

            const rejection = await expect(repository.getBySlug(slug)).rejects;

            rejection.toThrow(InternalServerErrorException);
            rejection.toHaveProperty(
                'message',
                'Failed to access the datasource',
            );

            expect(getDatasourceSpy).toHaveBeenCalledTimes(1);

            expect(logger.error).not.toHaveBeenCalled();
        });
    });

    describe('getImages', () => {
        it('should return product variant images when a valid variantId is provided', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const variantId = 1;
            const expectedImages = mockDatabase.product_variant_image.filter(
                (image) => image.variantId === variantId,
            );

            const result = await repository.getImages(variantId);

            expect(result).toEqual(expectedImages);
            expect(logger.log).toHaveBeenCalledWith(
                `Variant images found: ${expectedImages.length}`,
                ProductVariantRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if no images are found for the given variantId', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const invalidVariantId = 999;

            await expect(
                repository.getImages(invalidVariantId),
            ).rejects.toThrow(NotFoundException);
            expect(logger.warn).toHaveBeenCalledWith(
                `Variant images with variantId "${invalidVariantId}" not found`,
                ProductVariantRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if product_variant_image array is empty in the database', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabaseEmpty as Database,
            );

            const variantId = 1;

            await expect(repository.getImages(variantId)).rejects.toThrow(
                NotFoundException,
            );
            expect(logger.warn).toHaveBeenCalledWith(
                `Variant images with variantId "${variantId}" not found`,
                ProductVariantRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors from getDatasource', async () => {
            const errorMessage = 'Failed to load datasource';
            jest.spyOn(repository, 'getDatasource').mockRejectedValue(
                new Error(errorMessage),
            );

            const variantId = 1;

            await expect(repository.getImages(variantId)).rejects.toThrow(
                errorMessage,
            );
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });
});
