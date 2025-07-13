import { Module } from '@nestjs/common';
import { OfferRepository } from './offer.repository';

@Module({
    exports: [OfferRepository],
    providers: [OfferRepository],
})
export class OfferModule {}
