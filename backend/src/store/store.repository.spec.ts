import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { StoreRepository } from './store.repository';
import { AppLogger } from 'src/common/logger/logger.interface';
import { mockDatabase, mockDatabaseEmpty } from 'src/mock';
import { Database } from 'src/db/type';

describe('StoreRepository', () => {
    let repository: StoreRepository;
    let logger: AppLogger;

    const mockLogger = {
        warn: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StoreRepository,
                {
                    provide: 'LoggerService',
                    useValue: mockLogger,
                },
            ],
        }).compile();

        repository = module.get<StoreRepository>(StoreRepository);
        logger = module.get<AppLogger>('LoggerService');

        jest.clearAllMocks();
    });

    describe('getById', () => {
        it('should return a store when a valid ID is provided', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const storeId = 1;
            const expectedStore = mockDatabase.store.find(
                (store) => store.id === storeId,
            );

            const result = await repository.getById(storeId);

            expect(result).toEqual(expectedStore);
            expect(logger.log).toHaveBeenCalledWith(
                `Store found: ${expectedStore?.name}`,
                StoreRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if store is not found', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const invalidStoreId = 999;

            await expect(repository.getById(invalidStoreId)).rejects.toThrow(
                NotFoundException,
            );
            expect(logger.warn).toHaveBeenCalledWith(
                `Store with id "${invalidStoreId}" not found`,
                StoreRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if database is empty', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabaseEmpty as Database,
            );

            const storeId = 1;

            await expect(repository.getById(storeId)).rejects.toThrow(
                NotFoundException,
            );
            expect(logger.warn).toHaveBeenCalledWith(
                `Store with id "${storeId}" not found`,
                StoreRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors from getDatasource', async () => {
            const errorMessage = 'Failed to load datasource';
            jest.spyOn(repository, 'getDatasource').mockRejectedValue(
                new Error(errorMessage),
            );

            const storeId = 1;

            await expect(repository.getById(storeId)).rejects.toThrow(
                errorMessage,
            );
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });
});
