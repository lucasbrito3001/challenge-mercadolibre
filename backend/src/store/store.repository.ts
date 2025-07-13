import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AppLogger } from 'src/common/logger/logger.interface';
import { JsonRepository } from '../common/repository/json-repository';
import { Database, Store } from 'src/db/type';

@Injectable()
export class StoreRepository extends JsonRepository {
    constructor(
        @Inject('LoggerService')
        readonly logger: AppLogger,
    ) {
        super(logger);
    }

    async getById(id: number): Promise<Store> {
        let datasource: Database = await this.getDatasource();

        const store = datasource.store.find((store) => store.id === id);

        if (!store) {
            this.logger.warn(
                `Store with id "${id}" not found`,
                StoreRepository.name,
            );

            throw new NotFoundException('Store not found');
        }

        this.logger.log(`Store found: ${store.name}`, StoreRepository.name);
        return store;
    }
}
