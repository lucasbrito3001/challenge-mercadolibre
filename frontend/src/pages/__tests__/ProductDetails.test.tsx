import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProductDetails from "../ProductDetails";

vi.mock("../../hooks/breakpoint", () => ({
	default: vi.fn(),
}));

import useIsDesktop from "../../hooks/breakpoint";
import { mockProductDetails } from "../../utils/constants";
import { MemoryRouter } from "react-router-dom";

const mockProductDetailsService = {
	getById: vi.fn(),
};

describe("ProductDetails Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("check if all needed components is listed", async () => {
		(useIsDesktop as ReturnType<typeof vi.fn>).mockReturnValue(false);

		mockProductDetailsService.getById.mockResolvedValueOnce(mockProductDetails);

		render(
			<MemoryRouter>
				<ProductDetails productDetailsService={mockProductDetailsService} />
			</MemoryRouter>
		);

		const expectedOrder = [
			"product-title-component",
			"product-option-selector-component",
			"product-price-component",
			"checkout-card-component",
			"product-features-minified-component",
			"store-info-card-component",
			"product-description-component",
			"payment-methods-card-component",
		];

		await waitFor(() => {
			const actualOrder = expectedOrder.map((id) =>
				screen.queryByTestId(id)?.getAttribute("data-testid")
			);

			expect(actualOrder).toEqual(expectedOrder);
		});
	});
});
