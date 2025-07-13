import { Test, TestingModule } from '@nestjs/testing';
import {
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { OptionRepository } from './option.repository';
import { AppLogger } from 'src/common/logger/logger.interface';
import { Database, ProductOption, ProductOptionValue } from 'src/db/type';
import { mockDatabaseEmpty } from 'src/mock';

const mockProductOptions: ProductOption[] = [
    { id: 101, productId: 1, value: 'Cor' },
    { id: 102, productId: 1, value: 'Tamanho' },
    { id: 103, productId: 2, value: 'Material' },
];

const mockProductOptionValues: ProductOptionValue[] = [
    { id: 201, optionId: 101, value: 'Vermelho', imageUrl: 'url_vermelho.png' },
    { id: 202, optionId: 101, value: 'Azul', imageUrl: null },
    { id: 203, optionId: 102, value: 'Pequeno', imageUrl: null },
    { id: 204, optionId: 102, value: 'Grande', imageUrl: null },
    { id: 205, optionId: 103, value: 'Algodão', imageUrl: 'url_algodao.png' },
];

const mockDatabase: Database = {
    ...mockDatabaseEmpty,
    product_option: mockProductOptions,
    product_option_value: mockProductOptionValues,
};

describe('OptionRepository', () => {
    let repository: OptionRepository;
    let logger: AppLogger;
    let getDatasourceSpy: jest.SpyInstance;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OptionRepository,
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

        repository = module.get<OptionRepository>(OptionRepository);
        logger = module.get<AppLogger>('LoggerService');

        getDatasourceSpy = jest.spyOn(repository, 'getDatasource');

        jest.clearAllMocks();
    });

    afterEach(() => {
        getDatasourceSpy.mockRestore();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('getAllByProductId', () => {
        it('should return all options with their values for a given product ID', async () => {
            getDatasourceSpy.mockResolvedValueOnce(mockDatabase);

            const productId = 1;
            const result = await repository.getAllByProductId(productId);

            expect(getDatasourceSpy).toHaveBeenCalledTimes(1);

            expect(logger.log).toHaveBeenCalledWith(
                `Options found with productId: Cor, Tamanho`,
                OptionRepository.name,
            );

            expect(result).toHaveLength(2);
            expect(result[0].value).toBe('Cor');
            expect(result[0].optionValues).toHaveLength(2);
            expect(result[0].optionValues[0]).toEqual({
                id: 201,
                optionId: 101,
                value: 'Vermelho',
                imageUrl: 'url_vermelho.png',
            });
            expect(result[0].optionValues[1]).toEqual({
                id: 202,
                optionId: 101,
                value: 'Azul',
                imageUrl: null,
            });

            expect(result[1].value).toBe('Tamanho');
            expect(result[1].optionValues).toHaveLength(2);
            expect(result[1].optionValues[0]).toEqual({
                id: 203,
                optionId: 102,
                value: 'Pequeno',
                imageUrl: null,
            });
        });

        it('should return options with values when some imageURLs are null', async () => {
            getDatasourceSpy.mockResolvedValueOnce(mockDatabase);

            const productId = 1;
            const result = await repository.getAllByProductId(productId);

            expect(result).toHaveLength(2);
            expect(result[0].optionValues[1].imageUrl).toBeNull();
            expect(result[1].optionValues[0].imageUrl).toBeNull();
        });

        it('should throw NotFoundException if no options are found for the given product ID', async () => {
            getDatasourceSpy.mockResolvedValueOnce(mockDatabaseEmpty);

            const productId = 999;
            const rejection = await expect(
                repository.getAllByProductId(productId),
            ).rejects;

            rejection.toThrow(NotFoundException);
            rejection.toHaveProperty('message', 'Options not found');

            expect(getDatasourceSpy).toHaveBeenCalledTimes(1);
            expect(logger.warn).toHaveBeenCalledWith(
                `Options with productId "${productId}" not found`,
                OptionRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException if options are found but no option values exist for them', async () => {
            const noOptionValuesDb: Database = {
                ...mockDatabase,
                product_option_value: [],
            };
            getDatasourceSpy.mockResolvedValueOnce(noOptionValuesDb);

            const productId = 1;
            const rejection = await expect(
                repository.getAllByProductId(productId),
            ).rejects;

            rejection.toThrow(NotFoundException);
            rejection.toHaveProperty('message', 'Option values not found');

            expect(getDatasourceSpy).toHaveBeenCalledTimes(1);
            expect(logger.warn).toHaveBeenCalledWith(
                `Option values with optionId "${mockProductOptions[0].id}" not found`,
                OptionRepository.name,
            );
            expect(logger.log).not.toHaveBeenCalled();
        });

        it('should re-throw InternalServerErrorException if getDatasource fails', async () => {
            const mockGetDatasourceError = new InternalServerErrorException(
                'Failed to access the datasource',
            );

            getDatasourceSpy.mockRejectedValueOnce(mockGetDatasourceError);

            const productId = 1;
            const rejection = await expect(
                repository.getAllByProductId(productId),
            ).rejects;

            rejection.toThrow(InternalServerErrorException);
            rejection.toHaveProperty(
                'message',
                'Failed to access the datasource',
            );

            expect(getDatasourceSpy).toHaveBeenCalledTimes(1);

            expect(logger.error).not.toHaveBeenCalled();
            expect(logger.warn).not.toHaveBeenCalled();
            expect(logger.log).not.toHaveBeenCalled();
        });
    });
});
