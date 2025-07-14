import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NotFound } from "../NotFound"; // Ajuste o caminho conforme necessário

describe("NotFound Component", () => {
	// Mock window.location.href para evitar side effects reais no teste
	const originalLocation = window.location;

	beforeAll(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: { ...originalLocation, href: vi.fn() },
		});
	});

	afterAll(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: originalLocation,
		});
	});

	it("should render the component with the data-testid", () => {
		render(<NotFound />);
		expect(screen.getByTestId("not-found-component")).toBeInTheDocument();
	});

	it('should render the "Ups, algo salió mal" heading', () => {
		render(<NotFound />);
		expect(screen.getByText("Ups, algo salió mal")).toBeInTheDocument();
	});

	it("should render the descriptive message for product not found", () => {
		render(<NotFound />);
		expect(
			screen.getByText(
				"No pudimos encontrar el producto que buscas. Es posible que lo hayan eliminado o que nunca haya existido."
			)
		).toBeInTheDocument();
	});

	it('should render the "Regresar a la página de inicio" button', () => {
		render(<NotFound />);
		const button = screen.getByRole("button", {
			name: "Regresar a la página de inicio",
		});
		expect(button).toBeInTheDocument();
	});

	it("should navigate to the home page when the button is clicked", () => {
		render(<NotFound />);
		const button = screen.getByRole("button", {
			name: "Regresar a la página de inicio",
		});

		fireEvent.click(button);
		expect(window.location.href).toBe("/");
	});

	it("should have correct styling for the main container", () => {
		render(<NotFound />);
		const mainContainer = screen.getByTestId("not-found-component");
		expect(mainContainer).toHaveClass("flex");
		expect(mainContainer).toHaveClass("flex-col");
		expect(mainContainer).toHaveClass("items-center");
		expect(mainContainer).toHaveClass("justify-center");
		expect(mainContainer).toHaveClass("bg-gray-100");
		expect(mainContainer).toHaveClass("px-4");
		expect(mainContainer).toHaveClass("text-center");
		expect(mainContainer).toHaveClass("h-[92vh]");
	});

	it("should have correct styling for the content card", () => {
		render(<NotFound />);
		const contentCard = screen.getByText("Ups, algo salió mal").closest("div");
		expect(contentCard).toHaveClass("bg-white");
		expect(contentCard).toHaveClass("p-8");
		expect(contentCard).toHaveClass("rounded-2xl");
		expect(contentCard).toHaveClass("shadow-md");
		expect(contentCard).toHaveClass("max-w-md");
		expect(contentCard).toHaveClass("w-full");
	});
});
