import { render, screen, fireEvent } from "@testing-library/react";
import QuantitySelector from "../QuantitySelector";

describe("QuantitySelector Component", () => {
	it("renders initial quantity and correct label", () => {
		render(<QuantitySelector maxQuantity={3} />);
		const select = screen.getByLabelText("Seleccione la cantidad");
		expect(screen.getByText("Cantidad:")).toBeInTheDocument();
		expect(select).toHaveValue("1");
		expect(screen.getByText("unidad")).toBeInTheDocument();
	});

	it("renders correct number of options when maxQuantity is less than 5", () => {
		render(<QuantitySelector maxQuantity={3} />);
		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(3);
		expect(options.map((opt) => opt.textContent)).toEqual(["1", "2", "3"]);
	});

	it("limits the number of options to 5 when maxQuantity exceeds it", () => {
		render(<QuantitySelector maxQuantity={10} />);
		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(5);
		expect(options.map((opt) => opt.textContent)).toEqual(["1", "2", "3", "4", "5"]);
	});

	it("updates the selected quantity on change", () => {
		render(<QuantitySelector maxQuantity={5} />);
		const select = screen.getByLabelText("Seleccione la cantidad");
		fireEvent.change(select, { target: { value: "3" } });
		expect(select).toHaveValue("3");
		expect(screen.getByText("unidades")).toBeInTheDocument();
	});

	it("displays correct availability message for maxQuantity <= 30", () => {
		render(<QuantitySelector maxQuantity={15} />);
		expect(screen.getByText("(15 disponibles)")).toBeInTheDocument();
	});

	it("displays capped availability message for maxQuantity > 30", () => {
		render(<QuantitySelector maxQuantity={100} />);
		expect(screen.getByText("(+30 disponibles)")).toBeInTheDocument();
	});

	it("displays singular label when only one item is selected", () => {
		render(<QuantitySelector maxQuantity={2} />);
		const select = screen.getByLabelText("Seleccione la cantidad");
		fireEvent.change(select, { target: { value: "1" } });
		expect(screen.getByText("unidad")).toBeInTheDocument();
	});

	it("displays plural label when more than one item is selected", () => {
		render(<QuantitySelector maxQuantity={3} />);
		const select = screen.getByLabelText("Seleccione la cantidad");
		fireEvent.change(select, { target: { value: "2" } });
		expect(screen.getByText("unidades")).toBeInTheDocument();
	});
});
