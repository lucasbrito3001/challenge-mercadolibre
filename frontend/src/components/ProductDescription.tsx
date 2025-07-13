interface ProductDescriptionProps {
	text: string;
}

export default function ProductDescription({ text }: ProductDescriptionProps) {
	return (
		<section data-testid="product-description-component">
			<h2 className="mb-4 block">Descripción</h2>
			<p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>
		</section>
	);
}
