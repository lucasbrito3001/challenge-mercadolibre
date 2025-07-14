import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductVariant } from 'src/db/type';
import { ProductVariantService } from './product-variant.service';

interface ParseOptionsOutput {
    optionId: number;
    optionValueId: number;
}

@Controller('product-variant')
export class ProductVariantController {
    constructor(
        private readonly productVariantService: ProductVariantService,
    ) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiQuery({
        name: 'options',
        required: true,
        description:
            'Comma-separated list of optionId:optionValueId pairs. Example: options=1:2,2:4',
        example: '1:2,2:4',
    })
    @ApiResponse({
        status: 200,
        description: 'Variant found',
        example: { id: 1, slug: 'example-slug' },
    })
    @ApiResponse({ status: 404, description: 'Variant not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async findVariantByOptions(
        @Query('options') optionsParam: string,
    ): Promise<Pick<ProductVariant, 'id' | 'slug'>> {
        let parsedOptions: ParseOptionsOutput[] = [];

        try {
            parsedOptions = this.parseOptions(optionsParam);
        } catch (error) {
            throw new BadRequestException(
                `Invalid option format: ${optionsParam}`,
            );
        }

        return await this.productVariantService.findByOptions(parsedOptions);
    }

    private parseOptions(param: string): ParseOptionsOutput[] {
        return param.split(',').map((pair) => {
            const [optionId, optionValueId] = pair.split(':').map(Number);
            if (
                isNaN(optionId) ||
                isNaN(optionValueId) ||
                !optionId ||
                !optionValueId
            ) {
                throw new Error(`Invalid option format: ${pair}`);
            }
            return { optionId, optionValueId };
        });
    }
}
