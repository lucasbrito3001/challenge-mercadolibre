import { useState, type ChangeEvent } from "react";

type QuantitySelectorProps = {
	maxQuantity: number;
};

export default function QuantitySelector({ maxQuantity }: QuantitySelectorProps) {
	const maxAvailableToShow = 30;
	const [selectedQuantity, setSelectedQuantity] = useState(1);

	const optionsCount = Math.min(maxQuantity, 5);

	const handleQuantityChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setSelectedQuantity(Number(event.target.value));
	};

	const options = Array.from({ length: optionsCount }, (_, i) => i + 1);

	return (
		<div className="flex items-center gap-1">
			<p className="text-sm font-semibold">Cantidad:</p>
			<div className="relative">
				<div className="flex items-center gap-1 rounded-md py-1.5">
					<span className="font-semibold text-sm">{selectedQuantity}</span>
					<span className="text-sm">
						{selectedQuantity > 1 ? "unidades" : "unidad"}
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 text-blue-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</div>
				<select
					value={selectedQuantity}
					onChange={handleQuantityChange}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					aria-label="Seleccione la cantidad"
				>
					{options.map((num) => (
						<option key={num} value={num}>
							{num}
						</option>
					))}
				</select>
			</div>
			<span className="text-xs text-muted">
				({maxQuantity > maxAvailableToShow ? `+${maxAvailableToShow}` : maxQuantity}{" "}
				{maxQuantity > 1 ? "disponibles" : "disponible"})
			</span>
		</div>
	);
}
