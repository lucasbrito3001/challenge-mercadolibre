import { Test, TestingModule } from '@nestjs/testing';
import { AppLogger } from 'src/common/logger/logger.interface';
import { Database } from 'src/db/type';
import { ProductRepository } from './product.repository';
import { mockDatabase, mockDatabaseEmpty } from 'src/mock';
import { NotFoundException } from '@nestjs/common';

describe('ProductRepository', () => {
    let repository: ProductRepository;
    let logger: AppLogger;

    const validProductId = mockDatabase.product[0].id;
    const invalidProductId = 999;

    const mockLogger = {
        warn: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductRepository,
                {
                    provide: 'LoggerService',
                    useValue: mockLogger,
                },
            ],
        }).compile();

        repository = module.get<ProductRepository>(ProductRepository);
        logger = module.get<AppLogger>('LoggerService');

        jest.clearAllMocks();
    });

    describe('getById', () => {
        it('should return the product when a valid id is provided', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            const expectedProduct = mockDatabase.product.find(
                (product) => product.id === validProductId,
            );

            const result = await repository.getById(validProductId);

            expect(result).toEqual(expectedProduct);
            expect(logger.log).toHaveBeenCalledWith(
                `Product found: ${expectedProduct?.name}`,
                ProductRepository.name,
            );
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException and log a warning if no product is found for the given id', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabase as Database,
            );

            await expect(repository.getById(invalidProductId)).rejects.toThrow(
                NotFoundException,
            );
            await expect(repository.getById(invalidProductId)).rejects.toThrow(
                'Product variant not found',
            );
            expect(logger.warn).toHaveBeenCalledWith(
                `Product with id "${invalidProductId}" not found`,
                ProductRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if the product array is empty in the database', async () => {
            jest.spyOn(repository, 'getDatasource').mockResolvedValue(
                mockDatabaseEmpty as Database,
            );

            await expect(repository.getById(validProductId)).rejects.toThrow(
                NotFoundException,
            );
            expect(logger.warn).toHaveBeenCalledWith(
                `Product with id "${validProductId}" not found`,
                ProductRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should handle errors from getDatasource', async () => {
            const errorMessage = 'Failed to load datasource';
            jest.spyOn(repository, 'getDatasource').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(repository.getById(validProductId)).rejects.toThrow(
                errorMessage,
            );
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });
});
