import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductVariantRepository } from 'src/product-variant/product-variant.repository';
import { ProductVariant } from 'src/db/type';
import { ProductVariantService } from './product-variant.service';

describe('ProductVariantService', () => {
    let service: ProductVariantService;
    let variantRepository: ProductVariantRepository;

    const mockVariantRepository = {
        findByOptions: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductVariantService,
                {
                    provide: ProductVariantRepository,
                    useValue: mockVariantRepository,
                },
            ],
        }).compile();

        service = module.get<ProductVariantService>(ProductVariantService);
        variantRepository = module.get<ProductVariantRepository>(
            ProductVariantRepository,
        );

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findByOptions', () => {
        const mockOptions = [
            { optionId: 1, optionValueId: 1 },
            { optionId: 2, optionValueId: 3 },
        ];
        const mockFoundVariant: ProductVariant = {
            id: 1,
            productId: 101,
            sku: 'SKU123',
            slug: 'product-variant-slug-1',
            title: 'mock title',
            price: 100.0,
            stock: 50,
        };

        it('should return id and slug of the variant when found', async () => {
            mockVariantRepository.findByOptions.mockResolvedValue(
                mockFoundVariant,
            );

            const result = await service.findByOptions(mockOptions);

            expect(mockVariantRepository.findByOptions).toHaveBeenCalledTimes(
                1,
            );
            expect(mockVariantRepository.findByOptions).toHaveBeenCalledWith(
                mockOptions,
            );
            expect(result).toEqual({
                id: mockFoundVariant.id,
                slug: mockFoundVariant.slug,
            });
        });

        it('should rethrow any other error that variantRepository.findByOptions throws', async () => {
            const genericError = new Error('Database connection failed');
            mockVariantRepository.findByOptions.mockRejectedValue(genericError);

            const rejection = await expect(service.findByOptions(mockOptions))
                .rejects;

            rejection.toThrow(Error);
            rejection.toThrow('Database connection failed');

            expect(mockVariantRepository.findByOptions).toHaveBeenCalledWith(
                mockOptions,
            );
        });
    });
});
