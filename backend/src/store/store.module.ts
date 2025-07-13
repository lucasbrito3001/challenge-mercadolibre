import { Module } from '@nestjs/common';
import { StoreRepository } from './store.repository';

@Module({
    exports: [StoreRepository],
    providers: [StoreRepository],
})
export class StoreModule {}
