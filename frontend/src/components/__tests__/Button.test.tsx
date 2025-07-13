import { render, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button component", () => {
	it("renders the text correctly", () => {
		render(<Button type="primary" isFullWidth={false} text="Click me" />);
		expect(screen.getByRole("button")).toHaveTextContent("Click me");
	});

	it('applies primary styles when type="primary"', () => {
		render(<Button type="primary" isFullWidth={false} text="Primary" />);
		const btn = screen.getByRole("button");
		expect(btn).toHaveClass("bg-blue-500");
		expect(btn).toHaveClass("text-white");
	});

	it('applies secondary styles when type="secondary"', () => {
		render(<Button type="secondary" isFullWidth={false} text="Secondary" />);
		const btn = screen.getByRole("button");
		expect(btn).toHaveClass("bg-blue-100");
		expect(btn).toHaveClass("text-blue-500");
	});

	it("applies full width class when isFullWidth is true", () => {
		render(<Button type="primary" isFullWidth={true} text="Full width" />);
		const btn = screen.getByRole("button");
		expect(btn).toHaveClass("w-full");
	});

	it("applies fixed width class when isFullWidth is false", () => {
		render(<Button type="primary" isFullWidth={false} text="Fixed width" />);
		const btn = screen.getByRole("button");
		expect(btn).toHaveClass("w-[256px]");
	});
});
