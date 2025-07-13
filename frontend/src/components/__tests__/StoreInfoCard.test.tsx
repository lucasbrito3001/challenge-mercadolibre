import { render, screen } from "@testing-library/react";
import StoreInfoCard from "../StoreInfoCard";
import { describe, it, expect } from "vitest";

describe("StoreInfoCard Component", () => {
	const defaultProps = {
		iconUrl: "https://example.com/icon.png",
		bannerUrl: "https://example.com/banner.jpg",
		productsNumber: 42,
		isOfficial: true,
		name: "Awesome Store",
		salesNumber: 12000,
		isPositiveService: true,
		isOnTimeDelivery: true,
	};

	it("renders the store name", () => {
		render(<StoreInfoCard {...defaultProps} />);
		expect(screen.getByText("Awesome Store")).toBeInTheDocument();
	});

	it("renders the official badge when isOfficial is true", () => {
		render(<StoreInfoCard {...defaultProps} />);
		expect(screen.getByText("Tienda oficial de Mercado Libre")).toBeInTheDocument();
		expect(screen.getByAltText("logo verificado")).toBeInTheDocument();
	});

	it("does not render the official badge when isOfficial is false", () => {
		render(<StoreInfoCard {...defaultProps} isOfficial={false} />);
		expect(screen.queryByText("Tienda oficial de Mercado Libre")).not.toBeInTheDocument();
		expect(screen.queryByAltText("logo verificado")).not.toBeInTheDocument();
	});

	it("displays the formatted sales number", () => {
		render(<StoreInfoCard {...defaultProps} />);
		expect(screen.getByText("+12mil")).toBeInTheDocument();
	});

	it("displays positive service and delivery icons/texts", () => {
		render(<StoreInfoCard {...defaultProps} />);
		expect(screen.getByText(/Brinda buena atención/i)).toBeInTheDocument();
		expect(screen.getByText(/Entrega sus productos a tiempo/i)).toBeInTheDocument();
	});

	it("displays negative service and delivery icons/texts", () => {
		render(<StoreInfoCard {...defaultProps} isPositiveService={false} isOnTimeDelivery={false} />);
		expect(screen.getByText(/No brinda buena atención/i)).toBeInTheDocument();
		expect(screen.getByText(/No entrega sus productos a tiempo/i)).toBeInTheDocument();
	});

	it("renders the 'Go to store' button", () => {
		render(<StoreInfoCard {...defaultProps} />);
		expect(screen.getByRole("button", { name: /Ir a la tienda/i })).toBeInTheDocument();
	});
});
