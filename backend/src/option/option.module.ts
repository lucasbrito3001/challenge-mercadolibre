import { Module } from '@nestjs/common';
import { OptionRepository } from './option.repository';

@Module({
    exports: [OptionRepository],
    providers: [OptionRepository],
})
export class OptionModule {}
