import type { ProductDetails, VariantOptionDto } from "../types/ProductDetails";
import { api } from "../utils/api";

interface GetVariantByOptionsResult {
	id: number;
	slug: string;
}

interface ProductDetailsService {
	getById(id: string): Promise<ProductDetails | null>;
	// getVariantByOptions(slug: string): Promise<GetVariantByOptionsResult | null>;
}

export const productDetailsService: ProductDetailsService = {
	getById: async (id: string): Promise<ProductDetails | null> => {
		const result = await api.get<ProductDetails>(`/product/${id}`);

		if (!result.success) {
			console.warn("Erro ao buscar produto:", result.error);
			return null;
		}

		return result.data;
	},

	// getVariantByOptions: async (slug: string): Promise<GetVariantByOptionsResult | null> => {
	// 	const result = await api.get<GetVariantByOptionsResult>(
	// 		`/product-variant?options=${options
	// 			.map((option) => `${option.optionId}:${option.optionValueId}`)
	// 			.join(",")}`
	// 	);

	// 	if (!result.success) {
	// 		console.warn("Erro ao buscar produto:", result.error);
	// 		return null;
	// 	}

	// 	return result.data;
	// },
};
