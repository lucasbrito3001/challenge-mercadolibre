import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "../Auth"; // Ajuste o caminho conforme necessário

// Mock do useNavigate do react-router-dom
const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
	const actual = (await importOriginal()) as {};
	return {
		...actual,
		useNavigate: () => mockedUseNavigate,
	};
});

describe("Auth Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the "Estás autenticado" heading', () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);
		expect(screen.getByText("Estás autenticado")).toBeInTheDocument();
	});

	it('should render the "Buscar algo" paragraph', () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);
		expect(screen.getByText("Buscar algo")).toBeInTheDocument();
	});

	it('should render the search input with placeholder "Buscar productos"', () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);
		expect(screen.getByPlaceholderText("Buscar productos")).toBeInTheDocument();
	});

	it('should render the "Buscar" submit button', () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);
		expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
	});

	it("should navigate to the correct URL when a valid query is submitted", () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);

		const searchInput = screen.getByPlaceholderText("Buscar productos");
		const submitButton = screen.getByRole("button", { name: "Buscar" });

		const query = "celular";
		fireEvent.change(searchInput, { target: { value: query } });
		fireEvent.click(submitButton);

		expect(mockedUseNavigate).toHaveBeenCalledWith(`/${encodeURIComponent(query)}`);
	});

	it("should navigate to the correct URL with encoded query when query contains special characters", () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);

		const searchInput = screen.getByPlaceholderText("Buscar productos");
		const submitButton = screen.getByRole("button", { name: "Buscar" });

		const query = "fone de ouvido & sem fio";
		fireEvent.change(searchInput, { target: { value: query } });
		fireEvent.click(submitButton);

		expect(mockedUseNavigate).toHaveBeenCalledWith(`/${encodeURIComponent(query)}`);
	});

	it("should not navigate when an empty query is submitted", () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);

		const searchInput = screen.getByPlaceholderText("Buscar productos");
		const submitButton = screen.getByRole("button", { name: "Buscar" });

		fireEvent.change(searchInput, { target: { value: "" } });
		fireEvent.click(submitButton);

		expect(mockedUseNavigate).not.toHaveBeenCalled();
	});

	it("should not navigate when a query with only spaces is submitted", () => {
		render(
			<MemoryRouter>
				<Auth />
			</MemoryRouter>
		);

		const searchInput = screen.getByPlaceholderText("Buscar productos");
		const submitButton = screen.getByRole("button", { name: "Buscar" });

		fireEvent.change(searchInput, { target: { value: "   " } });
		fireEvent.click(submitButton);

		expect(mockedUseNavigate).not.toHaveBeenCalled();
	});
});
