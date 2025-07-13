import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { NotFoundException } from '@nestjs/common';
import { mockProductOutputDto } from 'src/mock';

describe('ProductController', () => {
    let controller: ProductController;
    let service: ProductService;

    const mockService = {
        findBySlug: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: mockService,
                },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        service = module.get<ProductService>(ProductService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findOne', () => {
        it('should return a product when found', async () => {
            mockService.findBySlug.mockResolvedValueOnce(mockProductOutputDto);

            const result = await controller.findOne('example-slug');

            expect(service.findBySlug).toHaveBeenCalledWith('example-slug');
            expect(result).toEqual(mockProductOutputDto);
        });

        it('should propagate unexpected errors', async () => {
            mockService.findBySlug.mockRejectedValueOnce(
                new Error('Database error'),
            );

            await expect(controller.findOne('error-slug')).rejects.toThrow(
                'Database error',
            );
            expect(service.findBySlug).toHaveBeenCalledWith('error-slug');
        });
    });
});
