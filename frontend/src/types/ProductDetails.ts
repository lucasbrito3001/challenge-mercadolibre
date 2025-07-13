export interface ProductOption {
	key: string;
	value: string;
	imageUrl: string;
}

export interface ProductStore {
	salesNumber: number;
	productsNumber: number;
	isOfficial: boolean;
	iconUrl: string;
	name: string;
	isPositiveService: boolean;
	isOnTimeDelivery: boolean;
	bannerUrl: string;
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

export interface ProductOptions {
	text: string;
	list: ProductOption[];
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
	offer: ProductOffer;
	store: ProductStore;
	options: ProductOptions;
	features: ProductFeature[];
}
