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
}

export interface VariantOutputOption {
    key: string;
    value: string;
    imageUrl: string;
}

export interface VariantsOutputDto {
    text: string;
    list: VariantOutputOption[];
}

export interface FeatureOutputDto {
    key: string | null;
    value: string;
    iconUrl: string | null;
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
    options: any[];
    features: FeatureOutputDto[];
}
