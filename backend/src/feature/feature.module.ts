import { Module } from '@nestjs/common';
import { FeatureRepository } from './feature.repository';

@Module({
    exports: [FeatureRepository],
    providers: [FeatureRepository],
})
export class FeatureModule {}
