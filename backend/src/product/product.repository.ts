import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { Database, Product } from 'src/db/type';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from 'src/common/repository/json-repository';

@Injectable()
export class ProductRepository extends JsonRepository {
    constructor(
        @Inject('LoggerService')
        readonly logger: AppLogger,
    ) {
        super(logger);
    }

    async getById(id: number): Promise<Product> {
        let datasource: Database = await this.getDatasource();

        const product = datasource.product.find((product) => product.id === id);

        if (!product) {
            this.logger.warn(
                `Product with id "${id}" not found`,
                ProductRepository.name,
            );
            throw new NotFoundException('Product variant not found');
        }

        this.logger.log(
            `Product found: ${product.name}`,
            ProductRepository.name,
        );
        return product;
    }
}
