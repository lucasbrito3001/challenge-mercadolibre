import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { productDetailsService } from "../productDetailsService";
import { api } from "../../utils/api";
import type { ProductDetails } from "../../types/ProductDetails";

vi.mock("../../utils/api", () => ({
	api: {
		get: vi.fn(),
	},
}));

const mockProductDetails: ProductDetails = {
	title: "Smartphone X",
	description: "Um smartphone incrível.",
	price: 1500,
	imageUrlList: ["http://example.com/image.jpg"],
	store: {
		name: "TechStore",
		salesNumber: 1000,
		productsNumber: 50,
		isOfficial: true,
		iconUrl: "http://example.com/icon.png",
		bannerUrl: "http://example.com/banner.png",
		isPositiveService: true,
		isOnTimeDelivery: true,
		status: 4,
	},
	features: [{ key: "Cor", value: "Preto" }],
	options: [{ id: 1, value: "Cor", optionValues: [{ id: 101, value: "Preto", imageUrl: null }] }],
	rating: 4.8,
	reviewCount: 120,
	quantitySold: 500,
	quantity: 10,
	offer: null,
	variantOptions: [],
	variants: [],
	reviews: [],
};

describe("ProductDetailsService", () => {
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		vi.clearAllMocks();

		consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
	});

	describe("getById", () => {
		it("should return product details when API call is successful", async () => {
			(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
				success: true,
				data: mockProductDetails,
			});

			const id = "123";
			const result = await productDetailsService.getById(id);

			expect(api.get).toHaveBeenCalledWith(`/product/${id}`);
			expect(result).toEqual(mockProductDetails);
		});

		it("should return null and log a warning when API call fails", async () => {
			const errorMessage = "Network Error";
			(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
				success: false,
				error: errorMessage,
			});

			const id = "456";
			const result = await productDetailsService.getById(id);

			expect(api.get).toHaveBeenCalledWith(`/product/${id}`);
			expect(result).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith("Erro ao buscar produto:", errorMessage);
		});

		it("should return null when API returns success: true but data is null/undefined", async () => {
			(api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
				success: true,
				data: null,
			});

			const id = "789";
			const result = await productDetailsService.getById(id);

			expect(api.get).toHaveBeenCalledWith(`/product/${id}`);
			expect(result).toBeNull();
			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});

		it("should handle unexpected errors during API call", async () => {
			const thrownError = new Error("Something went wrong with the request");
			(api.get as ReturnType<typeof vi.fn>).mockRejectedValue(thrownError);

			const id = "999";
			await expect(productDetailsService.getById(id)).rejects.toThrow(thrownError);

			expect(api.get).toHaveBeenCalledWith(`/product/${id}`);
			expect(consoleWarnSpy).not.toHaveBeenCalled();
		});
	});
});
