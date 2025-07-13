import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from 'src/common/logger/logger.interface';
import { Database, OfferStatuses } from 'src/db/type';
import { OfferRepository } from './offer.repository';
import { mockDatabase, mockDatabaseEmpty } from 'src/mock';

describe('OfferRepository', () => {
    let repository: OfferRepository;
    let logger: AppLogger;
    const validProductVariantId = mockDatabase.product_variant[0].id;
    const invalidProductVariantId = 999;

    const mockLogger = {
        warn: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OfferRepository,
                {
                    provide: 'LoggerService',
                    useValue: mockLogger,
                },
            ],
        }).compile();

        repository = module.get<OfferRepository>(OfferRepository);
        logger = module.get<AppLogger>('LoggerService');

        jest.clearAllMocks();
    });

    describe('getActiveOfferBySlug', () => {
        it('should return the active offer when a valid productVariantId with an active offer is provided', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const expectedOffer = mockDatabase.offer.find(
                (offer) =>
                    offer.productVariantId === validProductVariantId &&
                    offer.status === OfferStatuses.Active,
            );

            const result = await repository.getActiveOfferBySlug(
                validProductVariantId,
            );

            expect(result).toEqual(expectedOffer);
            expect(logger.log).toHaveBeenCalledWith(
                `Active offer found with productVariantId: ${validProductVariantId}`,
                OfferRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should return null if no active offer is found for the given productVariantId', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const result = await repository.getActiveOfferBySlug(
                invalidProductVariantId,
            );

            expect(result).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith(
                `Active offer with productVariantId "${invalidProductVariantId}" not found`,
                OfferRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should return null if an offer exists but is not in "Active" status', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const scheduledOfferVariantId = 3;
            const resultScheduled = await repository.getActiveOfferBySlug(
                scheduledOfferVariantId,
            );

            expect(resultScheduled).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith(
                `Active offer with productVariantId "${scheduledOfferVariantId}" not found`,
                OfferRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();

            jest.clearAllMocks();

            const doneOfferVariantId = 2;
            const resultDone =
                await repository.getActiveOfferBySlug(doneOfferVariantId);

            expect(resultDone).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith(
                `Active offer with productVariantId "${doneOfferVariantId}" not found`,
                OfferRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should return null if the offer array is empty in the database', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabaseEmpty as Database,
            );

            const result = await repository.getActiveOfferBySlug(
                validProductVariantId,
            );

            expect(result).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith(
                `Active offer with productVariantId "${validProductVariantId}" not found`,
                OfferRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors from getDatasource', async () => {
            const errorMessage = 'Failed to load datasource';
            jest.spyOn(repository, 'getDatasource').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(
                repository.getActiveOfferBySlug(validProductVariantId),
            ).rejects.toThrow(errorMessage);
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });
});
