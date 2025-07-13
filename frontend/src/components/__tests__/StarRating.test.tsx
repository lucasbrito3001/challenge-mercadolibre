import { render, screen } from "@testing-library/react";
import StarRating from "../StarRating";

describe("StarRating Component", () => {
	it("renders correct number of stars for 4", () => {
		render(<StarRating rating={4} reviewCount={120} />);
		expect(screen.getAllByTestId("full-star")).toHaveLength(4);
		expect(screen.getAllByTestId("empty-star")).toHaveLength(1);
		expect(screen.queryByTestId("half-star")).not.toBeInTheDocument();
		expect(screen.getByText("4")).toBeInTheDocument();
		expect(screen.getByText("(120)")).toBeInTheDocument();
	});

	it("renders correct number of stars for 3.5", () => {
		render(<StarRating rating={3.5} reviewCount={80} />);
		expect(screen.getAllByTestId("full-star")).toHaveLength(3);
		expect(screen.getAllByTestId("half-star")).toHaveLength(1);
		expect(screen.getAllByTestId("empty-star")).toHaveLength(1);
	});

	it("renders correct number of stars for 4.8", () => {
		render(<StarRating rating={4.8} reviewCount={230} />);
		expect(screen.getAllByTestId("full-star")).toHaveLength(5);
		expect(screen.queryByTestId("half-star")).not.toBeInTheDocument();
		expect(screen.queryByTestId("empty-star")).not.toBeInTheDocument();
	});

	it("renders correct number of stars for 1.2", () => {
		render(<StarRating rating={1.2} reviewCount={10} />);
		expect(screen.getAllByTestId("full-star")).toHaveLength(1);
		expect(screen.getAllByTestId("empty-star")).toHaveLength(4);
		expect(screen.queryByTestId("half-star")).not.toBeInTheDocument();
	});

	it("respects custom max prop", () => {
		render(<StarRating rating={2.5} max={10} reviewCount={45} />);
		const totalStars =
			screen.getAllByTestId("full-star").length +
			screen.getAllByTestId("half-star").length +
			screen.getAllByTestId("empty-star").length;
		expect(totalStars).toBe(10);
	});
});
