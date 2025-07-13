import { render, screen, fireEvent } from "@testing-library/react";
import ProductOptionSelector from "../ProductOptionSelector";

describe("ProductOptionSelector Component", () => {
	const options = [
		{ key: "red", value: "Red", imageUrl: "red.png" },
		{ key: "blue", value: "Blue", imageUrl: "blue.png" },
		{ key: "green", value: "Green", imageUrl: "green.png" },
	];
	const title = "Color";

	beforeEach(() => {
		// @ts-ignore
		delete window.location;
		// Mock window.location
		window.location = {
			href: "",
			pathname: "/",
		} as any;
	});

	it("displays the title and first option as selected by default", () => {
		render(<ProductOptionSelector title={title} options={options} />);
		expect(screen.getByText(`${title}:`)).toBeInTheDocument();
		expect(screen.getByText(options[0].value)).toBeInTheDocument();
	});

	it("highlights the option that matches the URL pathname", () => {
		window.location.pathname = `/${options[1].key}`;
		render(<ProductOptionSelector title={title} options={options} />);
		const selectedImage = screen.getByAltText(options[1].value);
		expect(selectedImage).toHaveClass("border-blue-600");
	});

	it("calls window.location.href with the correct path when an option is clicked", () => {
		render(<ProductOptionSelector title={title} options={options} />);
		const secondOptionButton = screen.getByAltText(options[1].value).parentElement;

		if (!secondOptionButton) throw new Error("Button not found");

		fireEvent.click(secondOptionButton);
		expect(window.location.href).toBe(`/${options[1].key}`);
	});

	it("does not apply selected styles to non-selected options", () => {
		render(<ProductOptionSelector title={title} options={options} />);
		const secondOptionImage = screen.getByAltText(options[1].value);
		expect(secondOptionImage).toHaveClass("border-gray-300");
	});
});
