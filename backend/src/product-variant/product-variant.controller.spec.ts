import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import {
    NotFoundException,
    BadRequestException,
    HttpStatus,
} from '@nestjs/common';
import { ProductVariant } from 'src/db/type';

describe('ProductVariantController', () => {
    let controller: ProductVariantController;
    let service: ProductVariantService;

    const mockProductVariant: Pick<ProductVariant, 'id' | 'slug'> = {
        id: 1,
        slug: 'smartphone-x100-preto-64gb',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductVariantController],
            providers: [
                {
                    provide: ProductVariantService,
                    useValue: {
                        findByOptions: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<ProductVariantController>(
            ProductVariantController,
        );
        service = module.get<ProductVariantService>(ProductVariantService);
    });

    describe('findVariantByOptions', () => {
        it('should return a product variant when valid options are provided', async () => {
            jest.spyOn(service, 'findByOptions').mockResolvedValue(
                mockProductVariant,
            );

            const optionsParam = '1:1,2:3';
            const result = await controller.findVariantByOptions(optionsParam);

            expect(result).toEqual(mockProductVariant);
            expect(service.findByOptions).toHaveBeenCalledWith([
                { optionId: 1, optionValueId: 1 },
                { optionId: 2, optionValueId: 3 },
            ]);
            expect(result.id).toBe(mockProductVariant.id);
            expect(result.slug).toBe(mockProductVariant.slug);
        });

        it('should throw BadRequestException for invalid option format (missing value)', async () => {
            const optionsParam = '1:,2:3';

            const rejection = await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects;

            rejection.toThrow(BadRequestException);
            rejection.toHaveProperty(
                'message',
                `Invalid option format: ${optionsParam}`,
            );
            expect(service.findByOptions).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException for invalid option format (non-numeric value)', async () => {
            const optionsParam = '1:abc,2:3';

            await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects.toThrow(BadRequestException);
            await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects.toHaveProperty(
                'message',
                `Invalid option format: ${optionsParam}`,
            );
            expect(service.findByOptions).not.toHaveBeenCalled();
        });

        it('should throw BadRequestException for malformed options string', async () => {
            const optionsParam = '1:1,invalid-pair';

            await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects.toThrow(BadRequestException);
            await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects.toHaveProperty(
                'message',
                `Invalid option format: ${optionsParam}`,
            );
            expect(service.findByOptions).not.toHaveBeenCalled();
        });

        it('should throw an error if the service call fails for reasons other than invalid format', async () => {
            const errorMessage = 'Database connection error';
            jest.spyOn(service, 'findByOptions').mockRejectedValue(
                new Error(errorMessage),
            );

            const optionsParam = '1:1,2:3';
            await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects.toThrow(errorMessage);
            expect(service.findByOptions).toHaveBeenCalledWith([
                { optionId: 1, optionValueId: 1 },
                { optionId: 2, optionValueId: 3 },
            ]);
        });

        it('should handle empty options string and throw BadRequestException', async () => {
            const optionsParam = '';

            await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects.toThrow(BadRequestException);
            await expect(
                controller.findVariantByOptions(optionsParam),
            ).rejects.toHaveProperty(
                'message',
                `Invalid option format: ${optionsParam}`,
            );
            expect(service.findByOptions).not.toHaveBeenCalled();
        });
    });
});
