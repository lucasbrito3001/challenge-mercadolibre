import { render, screen } from "@testing-library/react";
import CheckoutCard from "../CheckoutCard";

describe("CheckoutCard", () => {
	const defaultProps = {
		quantity: 5,
		storeIconUrl: "https://example.com/logo.png",
		isOfficialStore: true,
		storeName: "Loja Teste",
		storeSalesNumber: 1200,
	};

	it("mostra que o produto está disponível em estoque", () => {
		render(<CheckoutCard {...defaultProps} />);
		expect(screen.getByText(/stock disponible/i)).toBeInTheDocument();
	});

	it("mostra que o produto está indisponível quando quantity = 0", () => {
		render(<CheckoutCard {...defaultProps} quantity={0} />);
		expect(screen.getByText(/stock indisponible/i)).toBeInTheDocument();
	});

	it("renderiza os botões apenas quando há estoque", () => {
		const { rerender } = render(<CheckoutCard {...defaultProps} quantity={5} />);
		expect(screen.getByText("Comprar ahora")).toBeInTheDocument();
		expect(screen.getByText("Agregar al carrito")).toBeInTheDocument();

		rerender(<CheckoutCard {...defaultProps} quantity={0} />);
		expect(screen.queryByText("Comprar ahora")).not.toBeInTheDocument();
		expect(screen.queryByText("Agregar al carrito")).not.toBeInTheDocument();
	});

	it("exibe o nome da loja e o texto 'Tienda oficial' se for oficial", () => {
		render(<CheckoutCard {...defaultProps} />);
		expect(screen.getByText("Tienda oficial")).toBeInTheDocument();
		expect(screen.getByText(defaultProps.storeName)).toBeInTheDocument();
	});

	it("mostra a quantidade de vendas formatada", () => {
		render(<CheckoutCard {...defaultProps} />);
		expect(screen.getByText("+1mil ventas")).toBeInTheDocument();
	});
});
