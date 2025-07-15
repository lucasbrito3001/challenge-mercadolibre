export interface OfferOutputDto {
    price: number;
}

export interface StoreOutputDto {
    salesNumber: number;
    productsNumber: number;
    isOfficial: boolean;
    iconUrl: string;
    name: string;
    isPositiveService: boolean;
    isOnTimeDelivery: boolean;
    bannerUrl: string;
    status: 1 | 2 | 3 | 4 | 5;
}

export interface OptoinValueOutputDto {
    id: number;
    value: string;
    imageUrl: string | null;
    optionId: number;
}

export interface OptionsOutputDto {
    value: string;
    id: number;
    optionValues: OptoinValueOutputDto[];
}

export interface FeatureOutputDto {
    key: string | null;
    value: string;
    iconUrl: string | null;
}

export interface VariantOptionOutputDto {
    optionId: number;
    optionValueId: number;
}

export interface VariantOutputDto {
    id: number;
    slug: string;
    stock: number;
    optionValues: VariantOptionOutputDto[];
}

export interface ReviewOutputDto {
    comment: string;
    rating: number;
    photos: string[];
}

export interface ProductOutputDto {
    slug: string;
    sku: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    quantitySold: number;
    rating: number;
    reviewCount: number;
    imageUrlList: string[];
    offer: OfferOutputDto | null;
    store: StoreOutputDto;
    options: OptionsOutputDto[];
    features: FeatureOutputDto[];
    variantOptions: VariantOptionOutputDto[];
    variants: VariantOutputDto[];
    reviews: ReviewOutputDto[];
}
