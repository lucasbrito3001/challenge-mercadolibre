export interface ProductStore {
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

export interface ProductOffer {
	enabled: boolean;
	price: number;
}

export interface ProductFeature {
	key: string | null;
	value: string;
	iconUrl?: string | null;
}

export interface ProductOptionValue {
	value: string;
	imageUrl: string | null;
	id: number;
}

export interface ProductOption {
	value: string;
	id: number;
	optionValues: ProductOptionValue[];
}

export interface VariantOptionDto {
	optionId: number;
	optionValueId: number;
}

export interface Variant {
	id: number;
	slug: string;
	stock: number;
	optionValues: VariantOptionDto[];
}

export interface ReviewDto {
	comment: string;
	rating: number;
	photos: string[];
}

export interface ProductDetails {
	quantity: number;
	title: string;
	description: string;
	rating: number;
	reviewCount: number;
	quantitySold: number;
	imageUrlList: string[];
	price: number;
	offer: ProductOffer | null;
	store: ProductStore;
	options: ProductOption[];
	features: ProductFeature[];
	variantOptions: VariantOptionDto[];
	variants: Variant[];
	reviews: ReviewDto[];
}
