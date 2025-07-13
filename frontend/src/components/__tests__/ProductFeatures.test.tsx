import { render, screen } from "@testing-library/react";
import ProductFeatures from "../ProductFeatures";

describe("ProductFeatures Component", () => {
	const features = [
		{
			key: "Brand",
			value: "Samsung",
			iconUrl: "https://example.com/icon-brand.png",
		},
		{
			key: "Storage",
			value: "128GB",
			iconUrl: "https://example.com/icon-storage.png",
		},
		{
			key: "Battery",
			value: "5000mAh",
		},
		{
			key: "Weight",
			value: "170g",
		},
		{
			key: null,
			value: "Dual SIM",
		},
	];

	it("renders the section title correctly", () => {
		render(<ProductFeatures features={features} />);
		expect(
			screen.getByRole("heading", { name: /características del producto/i })
		).toBeInTheDocument();
	});

	it("renders all features with icons inside a list", () => {
		render(<ProductFeatures features={features} />);
		const iconFeatures = screen.getAllByRole("listitem");
		expect(iconFeatures.length).toBe(2);
		expect(screen.getByText("Brand:")).toBeInTheDocument();
		expect(screen.getByText("Samsung")).toBeInTheDocument();
		expect(screen.getByText("Storage:")).toBeInTheDocument();
		expect(screen.getByText("128GB")).toBeInTheDocument();
	});

	it("renders all features without icons inside a table", () => {
		render(<ProductFeatures features={features} />);
		expect(screen.getByText("Battery")).toBeInTheDocument();
		expect(screen.getByText("5000mAh")).toBeInTheDocument();
		expect(screen.getByText("Weight")).toBeInTheDocument();
		expect(screen.getByText("170g")).toBeInTheDocument();
	});

	it("does not render features without key in either list or table", () => {
		render(<ProductFeatures features={features} />);
		expect(screen.queryByText("Dual SIM")).not.toBeInTheDocument();
	});

	it("renders correct number of image elements for icons", () => {
		render(<ProductFeatures features={features} />);
		const images = screen.getAllByRole("img");
		expect(images.length).toBe(2);
		expect(images[0]).toHaveAttribute("src", "https://example.com/icon-brand.png");
		expect(images[1]).toHaveAttribute("src", "https://example.com/icon-storage.png");
	});
});
