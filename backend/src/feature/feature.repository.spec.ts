import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { Database } from 'src/db/type';
import { FeatureRepository } from './feature.repository';
import { mockDatabase, mockDatabaseEmpty } from 'src/mock';

describe('FeatureRepository', () => {
    let repository: FeatureRepository;
    let logger: AppLogger;
    const validProductId = mockDatabase.product_feature[0].productId;
    const invalidProductId = 999;

    const mockLogger = {
        warn: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeatureRepository,
                {
                    provide: 'LoggerService',
                    useValue: mockLogger,
                },
            ],
        }).compile();

        repository = module.get<FeatureRepository>(FeatureRepository);
        logger = module.get<AppLogger>('LoggerService');

        jest.clearAllMocks();
    });

    describe('getAllByProductId', () => {
        it('should return product features when a valid productId is provided', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const expectedFeatures = mockDatabase.product_feature.filter(
                (feature) => feature.productId === validProductId,
            );

            const result = await repository.getAllByProductId(validProductId);

            expect(result).toEqual(expectedFeatures);
            expect(logger.log).toHaveBeenCalledWith(
                `Features found: ${expectedFeatures.length}`,
                FeatureRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if no features are found for the given productId', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            await expect(
                repository.getAllByProductId(invalidProductId),
            ).rejects.toThrow(NotFoundException);
            expect(logger.warn).toHaveBeenCalledWith(
                `Feature with productId "${invalidProductId}" not found`,
                FeatureRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if product_feature array is empty in the database', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabaseEmpty as Database,
            );

            await expect(
                repository.getAllByProductId(validProductId),
            ).rejects.toThrow(NotFoundException);
            expect(logger.warn).toHaveBeenCalledWith(
                `Feature with productId "${validProductId}" not found`,
                FeatureRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors from getDatasource', async () => {
            const errorMessage = 'Failed to load datasource';
            jest.spyOn(repository, 'getDatasource').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(
                repository.getAllByProductId(validProductId),
            ).rejects.toThrow(errorMessage);
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });
});
