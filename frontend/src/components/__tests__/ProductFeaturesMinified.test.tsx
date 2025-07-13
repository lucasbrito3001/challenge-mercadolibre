import { render, screen } from "@testing-library/react";
import ProductFeaturesMinified from "../ProductFeaturesMinified";

describe("ProductFeaturesMinified Component", () => {
	const features = [
		{ key: "Brand", value: "Samsung" },
		{ key: "Model", value: "Galaxy A55" },
		{ key: "Color", value: "Blue" },
		{ key: "Storage", value: "128GB" },
		{ key: null, value: "Dual SIM" },
		{ key: "Battery", value: "5000mAh" },
	];

	it("renders the section title correctly", () => {
		render(<ProductFeaturesMinified features={features} maxItems={3} />);
		expect(screen.getByText("Lo que tienes que saber de este producto")).toBeInTheDocument();
	});

	it("renders only the maximum number of features specified", () => {
		render(<ProductFeaturesMinified features={features} maxItems={3} />);
		const listItems = screen.getAllByRole("listitem");
		expect(listItems.length).toBe(3);
	});

	it("displays features with and without keys properly", () => {
		render(<ProductFeaturesMinified features={features} maxItems={5} />);
		expect(screen.getByText("Brand: Samsung")).toBeInTheDocument();
		expect(screen.getByText("Model: Galaxy A55")).toBeInTheDocument();
		expect(screen.getByText("Dual SIM")).toBeInTheDocument();
	});

	it("displays the link to the full features section", () => {
		render(<ProductFeaturesMinified features={features} maxItems={4} />);
		const link = screen.getByRole("link", { name: /ver características/i });
		expect(link).toHaveAttribute("href", "#features-section");
	});
});
