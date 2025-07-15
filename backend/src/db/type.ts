export class Product {
    id: number;
    storeId: number;
    name: string;
    description: string;
    rating: number;
    reviewCount: number;
    quantitySold: number;
}

export class ProductOption {
    id: number;
    productId: number;
    value: string;
}

export class ProductOptionValue {
    id: number;
    optionId: number;
    value: string;
    imageUrl: string | null;
}

export class ProductVariant {
    id: number;
    productId: number;
    sku: string;
    slug: string;
    price: number;
    stock: number;
}

export class ProductVariantImage {
    id: number;
    variantId: number;
    url: string;
}

export class ProductVariantOptionValue {
    variantId: number;
    optionId: number;
    optionValueId: number;
}

export class Store {
    id: number;
    name: string;
    isOfficial: boolean;
    salesNumber: number;
    productsNumber: number;
    iconUrl: string;
    bannerUrl: string;
    isPositiveService: boolean;
    isOnTimeDelivery: boolean;
}

export enum OfferStatuses {
    Active = 'ACTIVE',
    Done = 'DONE',
    Scheduled = 'SCHEDULED',
}

export class Offer {
    id: number;
    productVariantId: number;
    offerPrice: number;
    status: OfferStatuses;
    startDate: string;
    endDate: string;
}

export class ProductFeature {
    productId: number;
    key: string | null;
    value: string;
    iconUrl: string | null;
}

export class Review {
    id: number;
    variantId: number;
    comment: string;
    rating: number;
}

export class ReviewPhoto {
    reviewId: number;
    url: string;
}

export type Database = {
    store: Store[];
    offer: Offer[];
    product: Product[];
    product_option: ProductOption[];
    product_option_value: ProductOptionValue[];
    product_feature: ProductFeature[];
    product_variant: ProductVariant[];
    product_variant_option_value: ProductVariantOptionValue[];
    product_variant_image: ProductVariantImage[];
    review: Review[];
    review_photo: ReviewPhoto[];
};
