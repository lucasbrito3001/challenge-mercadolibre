import type { ProductDetails } from "../types/ProductDetails";
import { api } from "../utils/api";
import { mockProductDetails } from "../utils/constants";

interface ProductDetailsService {
	getById(id: string): Promise<ProductDetails | null>;
}

export const productDetailsService: ProductDetailsService = {
	// getById: (id: string) => api.get<ProductDetails>(`/productDetails/${id}`),
	getById: async (id: string) => {
		if (id !== "samsung-galaxy-a55-5g-azul-oscuro-256-gb-8-gb") return null;

		return mockProductDetails;
	},
};
