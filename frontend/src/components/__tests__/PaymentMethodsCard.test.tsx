import { render, screen } from "@testing-library/react";
import PaymentMethodsCard from "../PaymentMethodsCard";
import { cashIconsUrl, creditCardIconsUrl, debitCardIconsUrl } from "../../utils/constants";

vi.mock("../../assets/card.png", () => ({
	default: "mocked-card.png",
}));

describe("PaymentMethodsCard Component", () => {
	it("renders the main title correctly", () => {
		render(<PaymentMethodsCard />);
		expect(screen.getByText("Medios de pago")).toBeInTheDocument();
	});

	it("renders the green banner with credit offer", () => {
		render(<PaymentMethodsCard />);
		expect(screen.getByText(/¡Paga en/i)).toBeInTheDocument();
		expect(screen.getByAltText("bank-card-back-side--v1")).toBeInTheDocument();
	});

	it("renders credit card section with images", () => {
		render(<PaymentMethodsCard />);
		expect(screen.getByText("Tarjetas de crédito")).toBeInTheDocument();
		const creditIcons = screen.getAllByTestId("credit-card");
		expect(creditIcons.length).toBe(creditCardIconsUrl.length);
	});

	it("renders debit card section with images", () => {
		render(<PaymentMethodsCard />);
		expect(screen.getByText("Tarjetas de débito")).toBeInTheDocument();
		const debitIcons = screen.getAllByTestId("debit-card");
		expect(debitIcons.length).toBe(debitCardIconsUrl.length);
	});

	it("renders cash section with images", () => {
		render(<PaymentMethodsCard />);
		expect(screen.getByText("Efectivo")).toBeInTheDocument();
		const cashIcons = screen.getAllByTestId("cash");
		expect(cashIcons.length).toBe(cashIconsUrl.length);
	});

	it("renders link to see more payment methods", () => {
		render(<PaymentMethodsCard />);
		expect(screen.getByRole("link", { name: /Conoce otros medios de pago/i })).toBeInTheDocument();
	});
});
