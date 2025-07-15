import { Module } from '@nestjs/common';
import { ReviewRepository } from './review.repository';

@Module({
    exports: [ReviewRepository],
    providers: [ReviewRepository],
})
export class ReviewModule {}
