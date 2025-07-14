import type { ProductDetails } from "../types/ProductDetails";
import { api } from "../utils/api";

interface ProductDetailsService {
	getById(id: string): Promise<ProductDetails | null>;
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
};
