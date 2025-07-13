import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ProductPrice from "../ProductPrice";

vi.mock("../FormattedPrice", () => {
	return {
		default: ({
			valueInCents,
			size,
			isMuted,
		}: {
			valueInCents: number;
			size: string;
			isMuted: boolean;
		}) => (
			<span data-testid={`formatted-price-${size}-${isMuted ? "muted" : "normal"}`}>
				Price: {valueInCents}
			</span>
		),
	};
});
vi.mock("../utils/utils", () => ({
	calcOfferPercentage: (price: number, offerPrice: number) =>
		Math.round(((price - offerPrice) / price) * 100),
}));

describe("ProductPrice Component", () => {
	it("renders prices correctly when offer is enabled", () => {
		const props = {
			isOfferEnabled: true,
			price: 10000,
			offerPrice: 7000,
		};

		render(<ProductPrice {...props} />);

		expect(screen.getByTestId("formatted-price-small-muted")).toHaveTextContent("Price: 10000");
		expect(screen.getByTestId("formatted-price-large-normal")).toHaveTextContent("Price: 7000");
		expect(screen.getByText("30% OFF")).toBeInTheDocument();
		expect(screen.getByTestId("formatted-price-normal-normal")).toHaveTextContent("Price: 700");
		expect(screen.getByText(/Ver medios de pago y promociones/i)).toBeInTheDocument();
	});

	it("renders prices correctly when offer is disabled", () => {
		const props = {
			isOfferEnabled: false,
			price: 10000,
			offerPrice: 7000,
		};

		render(<ProductPrice {...props} />);

		expect(screen.queryByTestId("formatted-price-small-muted")).not.toBeInTheDocument();
		expect(screen.getByTestId("formatted-price-large-normal")).toHaveTextContent("Price: 10000");
		expect(screen.queryByText(/OFF/)).not.toBeInTheDocument();
		expect(screen.getByTestId("formatted-price-normal-normal")).toHaveTextContent("Price: 1000");
	});
});
