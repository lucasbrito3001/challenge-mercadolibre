import { render, screen } from "@testing-library/react";
import FormattedPrice from "../FormattedPrice";

describe("FormattedPrice", () => {
	it("renderiza o valor convertido de centavos para reais", () => {
		render(<FormattedPrice valueInCents={12345} size="normal" isMuted={false} />);
		expect(screen.getByText("$123.45")).toBeInTheDocument();
	});

	it("aplica a classe correta para tamanho 'large'", () => {
		const { container } = render(
			<FormattedPrice valueInCents={10000} size="large" isMuted={false} />
		);
		expect(container.firstChild).toHaveClass("text-3xl");
	});

	it("aplica a classe correta para tamanho 'normal'", () => {
		const { container } = render(
			<FormattedPrice valueInCents={10000} size="normal" isMuted={false} />
		);
		expect(container.firstChild).toHaveClass("text-md");
	});

	it("aplica a classe correta para tamanho 'small'", () => {
		const { container } = render(
			<FormattedPrice valueInCents={10000} size="small" isMuted={false} />
		);
		expect(container.firstChild).toHaveClass("text-sm");
	});

	it("aplica a classe de texto riscado quando isMuted é true", () => {
		const { container } = render(
			<FormattedPrice valueInCents={10000} size="normal" isMuted={true} />
		);
		expect(container.firstChild).toHaveClass("text-muted");
		expect(container.firstChild).toHaveClass("line-through");
	});

	it("não aplica classe riscada quando isMuted é false", () => {
		const { container } = render(
			<FormattedPrice valueInCents={10000} size="normal" isMuted={false} />
		);
		expect(container.firstChild).not.toHaveClass("text-muted");
		expect(container.firstChild).not.toHaveClass("line-through");
	});
});
