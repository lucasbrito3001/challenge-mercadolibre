import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { ProductVariantRepository } from 'src/product-variant/product-variant.repository';
import { OfferRepository } from 'src/offer/offer.repository';
import {
    GetAllByProductIdOutput,
    OptionRepository,
} from 'src/option/option.repository';
import { StoreRepository } from 'src/store/store.repository';
import { FeatureRepository } from 'src/feature/feature.repository';
import { NotFoundException } from '@nestjs/common';
import { mockDatabase } from 'src/mock';

describe('ProductService', () => {
    let service: ProductService;
    let productRepository: ProductRepository;
    let variantRepository: ProductVariantRepository;
    let offerRepository: OfferRepository;
    let optionRepository: OptionRepository;
    let storeRepository: StoreRepository;
    let featureRepository: FeatureRepository;

    const mockSlug = mockDatabase.product_variant[0].slug;
    const invalidSlug = 'invalid-product-slug';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: ProductRepository,
                    useValue: {
                        getById: jest.fn(),
                    },
                },
                {
                    provide: ProductVariantRepository,
                    useValue: {
                        getBySlug: jest.fn(),
                        getImages: jest.fn(),
                    },
                },
                {
                    provide: OfferRepository,
                    useValue: {
                        getActiveOfferBySlug: jest.fn(),
                    },
                },
                {
                    provide: OptionRepository,
                    useValue: {
                        getAllByProductId: jest.fn(),
                    },
                },
                {
                    provide: StoreRepository,
                    useValue: {
                        getById: jest.fn(),
                    },
                },
                {
                    provide: FeatureRepository,
                    useValue: {
                        getAllByProductId: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        productRepository = module.get<ProductRepository>(ProductRepository);
        variantRepository = module.get<ProductVariantRepository>(
            ProductVariantRepository,
        );
        offerRepository = module.get<OfferRepository>(OfferRepository);
        optionRepository = module.get<OptionRepository>(OptionRepository);
        storeRepository = module.get<StoreRepository>(StoreRepository);
        featureRepository = module.get<FeatureRepository>(FeatureRepository);

        jest.clearAllMocks();
    });

    describe('findBySlug', () => {
        it('should return a ProductOutputDto with all relevant details when a valid slug is provided', async () => {
            const expectedProductVariant = mockDatabase.product_variant[0];
            const expectedProduct = mockDatabase.product[0];
            const expectedStore = mockDatabase.store[0];
            const expectedOffer = mockDatabase.offer[0];
            const expectedImages = mockDatabase.product_variant_image.filter(
                (img) => img.variantId === expectedProductVariant.id,
            );

            const expectedOptionsWithValues: GetAllByProductIdOutput[] = [
                {
                    id: 1,
                    productId: expectedProduct.id,
                    value: 'Cor',
                    optionValues: [
                        {
                            id: 1,
                            value: 'Azul cielo',
                            imageUrl:
                                'https://http2.mlstatic.com/D_Q_NP_726160-MLA75549316245_042024-R.webp',
                            optionId: 1,
                        },
                        {
                            id: 2,
                            value: 'Azul oscuro',
                            imageUrl:
                                'https://http2.mlstatic.com/D_Q_NP_777643-MLA75395342152_042024-R.webp',
                            optionId: 1,
                        },
                    ],
                },
                {
                    id: 2,
                    productId: expectedProduct.id,
                    value: 'Armazenamento',
                    optionValues: [
                        {
                            id: 3,
                            value: '64GB',
                            imageUrl: null,
                            optionId: 2,
                        },
                        {
                            id: 4,
                            value: '128GB',
                            imageUrl: null,
                            optionId: 2,
                        },
                    ],
                },
            ];

            const expectedFeatures = mockDatabase.product_feature.filter(
                (feat) => feat.productId === expectedProduct.id,
            );

            jest.spyOn(variantRepository, 'getBySlug').mockResolvedValue(
                expectedProductVariant,
            );
            jest.spyOn(variantRepository, 'getImages').mockResolvedValue(
                expectedImages,
            );
            jest.spyOn(productRepository, 'getById').mockResolvedValue(
                expectedProduct,
            );
            jest.spyOn(storeRepository, 'getById').mockResolvedValue(
                expectedStore,
            );
            jest.spyOn(
                offerRepository,
                'getActiveOfferBySlug',
            ).mockResolvedValue(expectedOffer);

            jest.spyOn(optionRepository, 'getAllByProductId').mockResolvedValue(
                expectedOptionsWithValues,
            );
            jest.spyOn(
                featureRepository,
                'getAllByProductId',
            ).mockResolvedValue(expectedFeatures);

            const result = await service.findBySlug(mockSlug);

            expect(variantRepository.getBySlug).toHaveBeenCalledWith(mockSlug);
            expect(variantRepository.getImages).toHaveBeenCalledWith(
                expectedProductVariant.id,
            );
            expect(productRepository.getById).toHaveBeenCalledWith(
                expectedProductVariant.productId,
            );
            expect(storeRepository.getById).toHaveBeenCalledWith(
                expectedProduct.storeId,
            );
            expect(offerRepository.getActiveOfferBySlug).toHaveBeenCalledWith(
                expectedProductVariant.id,
            );
            expect(optionRepository.getAllByProductId).toHaveBeenCalledWith(
                expectedProduct.id,
            );
            expect(featureRepository.getAllByProductId).toHaveBeenCalledWith(
                expectedProduct.id,
            );

            expect(result).toEqual({
                description: expectedProduct.description,
                price: expectedProductVariant.price,
                quantity: expectedProductVariant.stock,
                quantitySold: expectedProduct.quantitySold,
                rating: expectedProduct.rating,
                reviewCount: expectedProduct.reviewCount,
                sku: expectedProductVariant.sku,
                slug: expectedProductVariant.slug,
                title: expectedProduct.name,
                imageUrlList: expectedImages.map((image) => image.url),
                offer: { price: expectedOffer.offerPrice },
                options: expectedOptionsWithValues,
                store: {
                    name: expectedStore.name,
                    salesNumber: expectedStore.salesNumber,
                    productsNumber: expectedStore.productsNumber,
                    isOfficial: expectedStore.isOfficial,
                    iconUrl: expectedStore.iconUrl,
                    isPositiveService: expectedStore.isPositiveService,
                    isOnTimeDelivery: expectedStore.isOnTimeDelivery,
                    bannerUrl: expectedStore.bannerUrl,
                },
                features: expectedFeatures.map((feature) => ({
                    key: feature.key,
                    value: feature.value,
                    iconUrl: feature.iconUrl,
                })),
            });
        });

        it('should return null for offer if no active offer is found', async () => {
            const expectedProductVariant = mockDatabase.product_variant[0];
            const expectedProduct = mockDatabase.product[0];
            const expectedStore = mockDatabase.store[0];
            const expectedImages = mockDatabase.product_variant_image.filter(
                (img) => img.variantId === expectedProductVariant.id,
            );
            const expectedFeatures = mockDatabase.product_feature.filter(
                (feat) => feat.productId === expectedProduct.id,
            );

            const expectedOptionsWithValues: GetAllByProductIdOutput[] = [
                {
                    id: 1,
                    productId: expectedProduct.id,
                    value: 'Cor',
                    optionValues: [],
                },
            ];

            jest.spyOn(variantRepository, 'getBySlug').mockResolvedValue(
                expectedProductVariant,
            );
            jest.spyOn(variantRepository, 'getImages').mockResolvedValue(
                expectedImages,
            );
            jest.spyOn(productRepository, 'getById').mockResolvedValue(
                expectedProduct,
            );
            jest.spyOn(storeRepository, 'getById').mockResolvedValue(
                expectedStore,
            );
            jest.spyOn(
                offerRepository,
                'getActiveOfferBySlug',
            ).mockResolvedValue(null);
            jest.spyOn(optionRepository, 'getAllByProductId').mockResolvedValue(
                expectedOptionsWithValues,
            );
            jest.spyOn(
                featureRepository,
                'getAllByProductId',
            ).mockResolvedValue(expectedFeatures);

            const result = await service.findBySlug(mockSlug);

            expect(result.offer).toBeNull();
            expect(result.options).toEqual(expectedOptionsWithValues);
        });

        it('should throw NotFoundException if product variant is not found by slug', async () => {
            jest.spyOn(variantRepository, 'getBySlug').mockRejectedValue(
                new NotFoundException('Product variant not found'),
            );

            await expect(service.findBySlug(invalidSlug)).rejects.toThrow(
                NotFoundException,
            );
            expect(variantRepository.getBySlug).toHaveBeenCalledWith(
                invalidSlug,
            );
            expect(variantRepository.getImages).not.toHaveBeenCalled();
            expect(productRepository.getById).not.toHaveBeenCalled();
        });

        it('should throw error if getImages fails', async () => {
            const expectedProductVariant = mockDatabase.product_variant[0];
            const errorMessage = 'Failed to get images';
            jest.spyOn(variantRepository, 'getBySlug').mockResolvedValue(
                expectedProductVariant,
            );
            jest.spyOn(variantRepository, 'getImages').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(service.findBySlug(mockSlug)).rejects.toThrow(
                errorMessage,
            );
        });

        it('should throw error if getById (product) fails', async () => {
            const expectedProductVariant = mockDatabase.product_variant[0];
            const expectedImages = mockDatabase.product_variant_image.filter(
                (img) => img.variantId === expectedProductVariant.id,
            );
            const errorMessage = 'Failed to get product';

            jest.spyOn(variantRepository, 'getBySlug').mockResolvedValue(
                expectedProductVariant,
            );
            jest.spyOn(variantRepository, 'getImages').mockResolvedValue(
                expectedImages,
            );
            jest.spyOn(productRepository, 'getById').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(service.findBySlug(mockSlug)).rejects.toThrow(
                errorMessage,
            );
        });

        it('should throw error if getById (store) fails', async () => {
            const expectedProductVariant = mockDatabase.product_variant[0];
            const expectedProduct = mockDatabase.product[0];
            const expectedImages = mockDatabase.product_variant_image.filter(
                (img) => img.variantId === expectedProductVariant.id,
            );
            const errorMessage = 'Failed to get store';

            jest.spyOn(variantRepository, 'getBySlug').mockResolvedValue(
                expectedProductVariant,
            );
            jest.spyOn(variantRepository, 'getImages').mockResolvedValue(
                expectedImages,
            );
            jest.spyOn(productRepository, 'getById').mockResolvedValue(
                expectedProduct,
            );
            jest.spyOn(storeRepository, 'getById').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(service.findBySlug(mockSlug)).rejects.toThrow(
                errorMessage,
            );
        });

        it('should throw error if getAllByProductId (options) fails', async () => {
            const expectedProductVariant = mockDatabase.product_variant[0];
            const expectedProduct = mockDatabase.product[0];
            const expectedStore = mockDatabase.store[0];
            const expectedOffer = mockDatabase.offer[0];
            const expectedImages = mockDatabase.product_variant_image.filter(
                (img) => img.variantId === expectedProductVariant.id,
            );
            const errorMessage = 'Failed to get options';

            jest.spyOn(variantRepository, 'getBySlug').mockResolvedValue(
                expectedProductVariant,
            );
            jest.spyOn(variantRepository, 'getImages').mockResolvedValue(
                expectedImages,
            );
            jest.spyOn(productRepository, 'getById').mockResolvedValue(
                expectedProduct,
            );
            jest.spyOn(storeRepository, 'getById').mockResolvedValue(
                expectedStore,
            );
            jest.spyOn(
                offerRepository,
                'getActiveOfferBySlug',
            ).mockResolvedValue(expectedOffer);
            jest.spyOn(optionRepository, 'getAllByProductId').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(service.findBySlug(mockSlug)).rejects.toThrow(
                errorMessage,
            );
        });

        it('should throw error if getAllByProductId (features) fails', async () => {
            const expectedProductVariant = mockDatabase.product_variant[0];
            const expectedProduct = mockDatabase.product[0];
            const expectedStore = mockDatabase.store[0];
            const expectedOffer = mockDatabase.offer[0];
            const expectedImages = mockDatabase.product_variant_image.filter(
                (img) => img.variantId === expectedProductVariant.id,
            );

            const expectedOptionsWithValues: GetAllByProductIdOutput[] = [
                {
                    id: 1,
                    productId: expectedProduct.id,
                    value: 'Cor',
                    optionValues: [],
                },
            ];
            const errorMessage = 'Failed to get features';

            jest.spyOn(variantRepository, 'getBySlug').mockResolvedValue(
                expectedProductVariant,
            );
            jest.spyOn(variantRepository, 'getImages').mockResolvedValue(
                expectedImages,
            );
            jest.spyOn(productRepository, 'getById').mockResolvedValue(
                expectedProduct,
            );
            jest.spyOn(storeRepository, 'getById').mockResolvedValue(
                expectedStore,
            );
            jest.spyOn(
                offerRepository,
                'getActiveOfferBySlug',
            ).mockResolvedValue(expectedOffer);
            jest.spyOn(optionRepository, 'getAllByProductId').mockResolvedValue(
                expectedOptionsWithValues,
            );
            jest.spyOn(
                featureRepository,
                'getAllByProductId',
            ).mockRejectedValue(new Error(errorMessage));

            await expect(service.findBySlug(mockSlug)).rejects.toThrow(
                errorMessage,
            );
        });
    });
});
