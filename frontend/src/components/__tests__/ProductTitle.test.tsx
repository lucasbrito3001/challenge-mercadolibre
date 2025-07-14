import { render, screen } from "@testing-library/react";
import ProductTitle from "../ProductTitle";

vi.mock("../StarRating", () => {
	return {
		default: ({ rating, reviewCount }: { rating: number; reviewCount: number }) => (
			<div data-testid="star-rating">
				Rating: {rating}, Reviews: {reviewCount}
			</div>
		),
	};
});

describe("ProductTitle Component", () => {
	const props = {
		quantitySold: 1234,
		rating: 4.5,
		reviewCount: 98,
		slug: "awesome-product-black-small"
	};

	it("renders formatted quantity sold text when over 1000", () => {
		render(<ProductTitle {...props} />);
		expect(screen.getByText("+1mil vendidos")).toBeInTheDocument();
	});

	it("renders formatted quantity sold text when under 1000", () => {
		render(<ProductTitle {...props} quantitySold={163} />);
		expect(screen.getByText("163 vendidos")).toBeInTheDocument();
	});

	it("renders the product title", () => {
		render(<ProductTitle {...props} />);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("awesome product black small");
	});
});
