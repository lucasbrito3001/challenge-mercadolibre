import type { ProductDetails } from "../types/ProductDetails";

export const mockProductDetails: ProductDetails = {
	description: "Poderoso e elegante, com câmera tripla.",
	price: 2299.99,
	quantity: 12,
	quantitySold: 3000,
	rating: 4.8,
	reviewCount: 512,
	title: "Smartphone X100",
	imageUrlList: ["https://example.com/products/x100/blue.png"],
	offer: null,
	store: {
		salesNumber: 10000,
		productsNumber: 120,
		isOfficial: true,
		iconUrl: "https://example.com/store1/icon.png",
		name: "TechZone",
		isPositiveService: true,
		isOnTimeDelivery: true,
		bannerUrl: "https://example.com/store1/banner.png",
		status: 3,
	},
	options: [
		{
			value: "Cor",
			id: 1,
			optionValues: [
				{
					value: "Azul cielo",
					imageUrl:
						"https://http2.mlstatic.com/D_Q_NP_726160-MLA75549316245_042024-R.webp",
					id: 1,
				},
				{
					value: "Azul oscuro",
					imageUrl:
						"https://http2.mlstatic.com/D_Q_NP_777643-MLA75395342152_042024-R.webp",
					id: 2,
				},
			],
		},
		{
			value: "Armazenamento",
			id: 2,
			optionValues: [
				{
					value: "64GB",
					imageUrl: null,
					id: 3,
				},
				{
					value: "128GB",
					imageUrl: null,
					id: 4,
				},
			],
		},
	],
	features: [
		{
			key: "Tela",
			value: "6.5'' AMOLED",
			iconUrl: null,
		},
		{
			key: "Processador",
			value: "Octa-core 2.4GHz",
			iconUrl: null,
		},
	],
	variantOptions: [
		{
			optionId: 1,
			optionValueId: 2,
		},
		{
			optionId: 2,
			optionValueId: 4,
		},
	],
	variants: [
		{
			id: 1,
			slug: "smartphone-x100-preto-64gb",
			stock: 25,
			optionValues: [
				{
					optionId: 1,
					optionValueId: 1,
				},
				{
					optionId: 2,
					optionValueId: 3,
				},
			],
		},
		{
			id: 2,
			slug: "smartphone-x100-azul-128gb",
			stock: 12,
			optionValues: [
				{
					optionId: 1,
					optionValueId: 2,
				},
				{
					optionId: 2,
					optionValueId: 4,
				},
			],
		},
	],
	reviews: [
		{
			comment: "mock-comment",
			rating: 4,
			photos: [""],
		},
	],
};

export const creditCardIconsUrl = [
	"https://http2.mlstatic.com/storage/logos-api-admin/aa2b8f70-5c85-11ec-ae75-df2bef173be2-m.svg",
	"https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg",
	"https://http2.mlstatic.com/storage/logos-api-admin/37f7b160-6278-11ec-ae75-df2bef173be2-m.svg",
	"https://http2.mlstatic.com/storage/logos-api-admin/ddf23a60-f3bd-11eb-a186-1134488bf456-m.svg",
];

export const debitCardIconsUrl = [
	"https://http2.mlstatic.com/storage/logos-api-admin/aa2b8f70-5c85-11ec-ae75-df2bef173be2-m.svg",
	"https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg",
];

export const cashIconsUrl = [
	"https://http2.mlstatic.com/storage/logos-api-admin/f99fcca0-f3bd-11eb-9984-b7076edb0bb7-m.svg",
];

export const onTimeDeliveryStatusIcon = {
	positive: "https://http2.mlstatic.com/frontend-assets/vpp-frontend/time-positive-v2.svg",
	negative: "https://http2.mlstatic.com/frontend-assets/vpp-frontend/time-negative-v2.svg",
};

export const serviceStatusIcon = {
	positive: "https://http2.mlstatic.com/frontend-assets/vpp-frontend/message-positive-v2.svg",
	negative: "https://http2.mlstatic.com/frontend-assets/vpp-frontend/message-negative-v2.svg",
};
