import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductOutputDto } from './dto/get-product.dto';
import { ApiResponse } from '@nestjs/swagger';
import { mockProductOutputDto } from 'src/mock';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get(':slug')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'Product found', example: mockProductOutputDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Product or some needed resource not found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async findOne(@Param('slug') slug: string): Promise<ProductOutputDto> {
        return await this.productService.findBySlug(slug);
    }
}
