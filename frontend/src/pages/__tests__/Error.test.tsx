import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Error from "../Error";

describe("Error Component", () => {
	it('should render the "Ups, algo salió mal" heading', () => {
		render(<Error />);
		expect(screen.getByText("Ups, algo salió mal")).toBeInTheDocument();
	});

	it("should render the descriptive error message", () => {
		render(<Error />);
		expect(
			screen.getByText(
				"Se produjo un error interno del servidor. Estamos trabajando para resolverlo lo antes posible."
			)
		).toBeInTheDocument();
	});

	it('should render the "Regresar a la página de inicio" link', () => {
		render(<Error />);
		const linkElement = screen.getByRole("link", {
			name: "Regresar a la página de inicio",
		});
		expect(linkElement).toBeInTheDocument();
		expect(linkElement).toHaveAttribute("href", "/");
	});

	it("should have correct styling for the main container", () => {
		render(<Error />);
		const mainContainer = screen.getByText("Ups, algo salió mal").closest("div")?.parentElement;
		expect(mainContainer).toHaveClass("bg-yellow-50");
		expect(mainContainer).toHaveClass("flex");
		expect(mainContainer).toHaveClass("items-center");
		expect(mainContainer).toHaveClass("justify-center");
		expect(mainContainer).toHaveClass("h-[92vh]");
		expect(mainContainer).toHaveClass("p-6");
	});

	it("should have correct styling for the content card", () => {
		render(<Error />);
		const contentCard = screen.getByText("Ups, algo salió mal").closest("div");
		expect(contentCard).toHaveClass("bg-white");
		expect(contentCard).toHaveClass("shadow-xl");
		expect(contentCard).toHaveClass("rounded-2xl");
		expect(contentCard).toHaveClass("p-10");
		expect(contentCard).toHaveClass("max-w-md");
		expect(contentCard).toHaveClass("w-full");
		expect(contentCard).toHaveClass("text-center");
	});
});
