import { render, screen, fireEvent } from "@testing-library/react";
import type { ProductOption, VariantOptionDto } from "../../types/ProductDetails";
import ProductOptionSelector from "../ProductOptionSelector";

describe("ProductOptionSelector", () => {
	const mockOnChange = vi.fn();

	const mockOptions: ProductOption[] = [
		{
			id: 1,
			value: "Color",
			optionValues: [
				{ id: 101, value: "Red", imageUrl: "red.jpg" },
				{ id: 102, value: "Blue", imageUrl: "blue.jpg" },
			],
		},
		{
			id: 2,
			value: "Storage",
			optionValues: [
				{ id: 201, value: "64GB", imageUrl: null },
				{ id: 202, value: "128GB", imageUrl: null },
			],
		},
	];

	it("should render the component with correct structure", () => {
		const currentOptions: VariantOptionDto[] = [
			{ optionId: 1, optionValueId: 101 },
			{ optionId: 2, optionValueId: 201 },
		];

		render(
			<ProductOptionSelector
				options={mockOptions}
				currentOptions={currentOptions}
				onChange={mockOnChange}
			/>
		);

		expect(screen.getByTestId("product-option-selector-component")).toBeInTheDocument();

		expect(screen.getByText("Color:")).toBeInTheDocument();
		expect(screen.getByText("Storage:")).toBeInTheDocument();
		expect(screen.getAllByTestId("option-value-selected")[0].textContent).toBe("Red");
		expect(screen.getAllByTestId("option-value-selected")[1].textContent).toBe("64GB");
	});

	it("should display image for option values that have imageUrl", () => {
		const currentOptions: VariantOptionDto[] = [{ optionId: 1, optionValueId: 101 }];

		render(
			<ProductOptionSelector
				options={mockOptions}
				currentOptions={currentOptions}
				onChange={mockOnChange}
			/>
		);

		const redImage = screen.getByAltText("Red");
		expect(redImage).toBeInTheDocument();
		expect(redImage).toHaveAttribute("src", "red.jpg");
	});

	it("should display text for option values that do not have imageUrl", () => {
		const currentOptions: VariantOptionDto[] = [{ optionId: 1, optionValueId: 102 }];

		render(
			<ProductOptionSelector
				options={mockOptions}
				currentOptions={currentOptions}
				onChange={mockOnChange}
			/>
		);

		expect(screen.getByText("64GB")).toBeInTheDocument();

		expect(screen.queryByAltText("64GB")).not.toBeInTheDocument();
	});

	it("should call onChange with correct values when an option value is clicked", () => {
		const currentOptions: VariantOptionDto[] = [{ optionId: 1, optionValueId: 101 }];

		render(
			<ProductOptionSelector
				options={mockOptions}
				currentOptions={currentOptions}
				onChange={mockOnChange}
			/>
		);

		const storage128GBButton = screen.getByText("128GB");
		fireEvent.click(storage128GBButton);

		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(mockOnChange).toHaveBeenCalledWith(2, 202);
	});

	it("should apply the correct styling to the currently selected option value", () => {
		const currentOptions: VariantOptionDto[] = [
			{ optionId: 1, optionValueId: 101 },
			{ optionId: 2, optionValueId: 202 },
		];

		render(
			<ProductOptionSelector
				options={mockOptions}
				currentOptions={currentOptions}
				onChange={mockOnChange}
			/>
		);

		const redButton = screen.getByAltText("Red").closest("button");
		const blueButton = screen.getByAltText("Blue").closest("button");
		const storage64GBButton = screen.getByText("64GB").closest("button");
		const storage128GBButton = screen.getAllByText("128GB")[1].closest("button");

		expect(redButton).toHaveClass("border-blue-600");
		expect(blueButton).toHaveClass("border-gray-300");
		expect(storage128GBButton).toHaveClass("border-blue-600");
		expect(storage64GBButton).toHaveClass("border-gray-300");
	});

	it('should correctly display "undefined" as current option value name if not found in currentOptions', () => {
		const currentOptions: VariantOptionDto[] = [{ optionId: 99, optionValueId: 999 }];

		render(
			<ProductOptionSelector
				options={mockOptions}
				currentOptions={currentOptions}
				onChange={mockOnChange}
			/>
		);

		expect(screen.getByText("Color:").querySelector("b")).toHaveTextContent("");

		expect(screen.getByText("Storage:").querySelector("b")).toHaveTextContent("");
	});

	it("should render correctly with empty options array", () => {
		render(<ProductOptionSelector options={[]} currentOptions={[]} onChange={mockOnChange} />);
		expect(screen.getByTestId("product-option-selector-component")).toBeInTheDocument();
		expect(screen.getByTestId("product-option-selector-component")).toBeEmptyDOMElement();
	});

	it("should render correctly with empty currentOptions array", () => {
		render(
			<ProductOptionSelector
				options={mockOptions}
				currentOptions={[]}
				onChange={mockOnChange}
			/>
		);
		expect(screen.getByText("Color:")).toBeInTheDocument();
		expect(screen.getByText("Storage:")).toBeInTheDocument();

		expect(screen.getByText("Color:").querySelector("b")).toHaveTextContent("");
		expect(screen.getByText("Storage:").querySelector("b")).toHaveTextContent("");

		const redButton = screen.getByAltText("Red").closest("button");
		expect(redButton).toHaveClass("border-gray-300");
	});
});
