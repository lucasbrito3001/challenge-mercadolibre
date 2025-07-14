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

    describe('getOptionValues', () => {
        const existingVariantId =
            mockDatabase.product_variant_option_value[0].variantId;
        const nonExistingVariantId = 999;

        it('should return option values when variantId is found', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const expectedOptionValues =
                mockDatabase.product_variant_option_value.filter(
                    (pvov) => pvov.variantId === existingVariantId,
                );

            const result = await repository.getOptionValues(existingVariantId);

            expect(result).toEqual(expectedOptionValues);
            expect(repository.getDatasource).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledWith(
                `Variant option values found: ${expectedOptionValues.length}`,
                ProductVariantRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException when variantId is not found', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const rejection = await expect(
                repository.getOptionValues(nonExistingVariantId),
            ).rejects;

            await rejection.toThrow(NotFoundException);
            await rejection.toThrow('Variant option values not found');

            expect(repository.getDatasource).toHaveBeenCalledTimes(1);
            expect(logger.warn).toHaveBeenCalledTimes(1);
            expect(logger.warn).toHaveBeenCalledWith(
                `Variant option values with variantId "${nonExistingVariantId}" not found`,
                ProductVariantRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors from getDatasource', async () => {
            const errorMessage = 'Failed to load datasource';
            (repository.getDatasource as jest.Mock).mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(
                repository.getOptionValues(existingVariantId),
            ).rejects.toThrow(errorMessage);

            expect(repository.getDatasource).toHaveBeenCalledTimes(1);
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });

    describe('findByOptions', () => {
        const variant1 = mockDatabase.product_variant[0];

        const variant1Options: { optionId: number; optionValueId: number }[] = [
            { optionId: 1, optionValueId: 1 },
            { optionId: 2, optionValueId: 3 },
        ];

        it('should return the correct variant when options match exactly', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const result = await repository.findByOptions(variant1Options);

            expect(result).toEqual(variant1);
            expect(repository.getDatasource).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.log).toHaveBeenCalledWith(
                `Variant found by options: ${variant1.sku}`,
                ProductVariantRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should return the correct variant when options are provided in a different order', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const reorderedOptions = [
                { optionId: 2, optionValueId: 3 },
                { optionId: 1, optionValueId: 1 },
            ];

            const result = await repository.findByOptions(reorderedOptions);

            expect(result).toEqual(variant1);
            expect(logger.log).toHaveBeenCalledTimes(1);
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if no variant matches the provided options', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const nonMatchingOptions = [
                { optionId: 1, optionValueId: 999 },
                { optionId: 2, optionValueId: 3 },
            ];

            const rejection = await expect(
                repository.findByOptions(nonMatchingOptions),
            ).rejects;

            rejection.toThrow(NotFoundException);
            rejection.toThrow('Variant not found for provided options');

            expect(repository.getDatasource).toHaveBeenCalledTimes(1);
            expect(logger.warn).toHaveBeenCalledWith(
                `No variant matches options: ${JSON.stringify(nonMatchingOptions)}`,
                ProductVariantRepository.name,
            );
        });

        it('should throw NotFoundException if a variant has more options than the input (partial match, but not exact)', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const partialOptions = [{ optionId: 1, optionValueId: 1 }];

            const rejection = await expect(
                repository.findByOptions(partialOptions),
            ).rejects;

            rejection.toThrow(NotFoundException);
            rejection.toThrow('Variant not found for provided options');
            expect(logger.warn).toHaveBeenCalledWith(
                `No variant matches options: ${JSON.stringify(partialOptions)}`,
                ProductVariantRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if a variant has fewer options than the input', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const excessOptions = [
                { optionId: 3, optionValueId: 5 },
                { optionId: 99, optionValueId: 99 },
            ];

            const rejection = await expect(
                repository.findByOptions(excessOptions),
            ).rejects;

            rejection.toThrow(NotFoundException);
            rejection.toThrow('Variant not found for provided options');

            expect(logger.warn).toHaveBeenCalledWith(
                `No variant matches options: ${JSON.stringify(excessOptions)}`,
                ProductVariantRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors from getDatasource', async () => {
            const errorMessage = 'Failed to load datasource';
            (repository.getDatasource as jest.Mock).mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(
                repository.findByOptions(variant1Options),
            ).rejects.toThrow(errorMessage);

            expect(repository.getDatasource).toHaveBeenCalledTimes(1);
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });

    describe('getVariantsWithOptionsByProductId', () => {
        it('should return variants with their option values by productId', async () => {
            (repository.getDatasource as jest.Mock).mockResolvedValue(
                mockDatabase as Database,
            );

            const productId = mockDatabase.product[0].id;
            const variant = mockDatabase.product_variant.find(
                (variant) => variant.productId === mockDatabase.product[0].id,
            );

            const result =
                await repository.getVariantsWithOptionsByProductId(productId);

            expect(result).toHaveLength(2);
            expect(result[0].sku).toBe(variant?.sku);
            expect(result[0].optionValues).toEqual([
                { variantId: 1, optionId: 1, optionValueId: 1 },
                { variantId: 1, optionId: 2, optionValueId: 3 },
            ]);
            expect(logger.log).toHaveBeenCalledWith(
                'Found 2 variants with options for productId "1"',
                'ProductVariantRepository',
            );
        });

        it('should return empty array and log warning if no variants found', async () => {
            jest.spyOn(repository as any, 'getDatasource').mockResolvedValue({
                ...mockDatabase,
                product_variant: [],
            });

            await expect(
                repository.getVariantsWithOptionsByProductId(999),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
