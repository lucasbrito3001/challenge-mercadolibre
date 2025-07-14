import type {
	ProductOption,
	ProductOptionValue,
	Variant,
	VariantOptionDto,
} from "../types/ProductDetails";

interface ProductOptionSelectorProps {
	options: ProductOption[];
	pathPrefix: string;
	currentOptions: VariantOptionDto[];
	variants: Variant[];
	onChange(optionId: number, optionValueId: number): void;
}

export default function ProductOptionSelector({
	options,
	currentOptions,
	variants,
	onChange,
}: ProductOptionSelectorProps) {
	const getCurrentOptionValueName = (
		optionId: number,
		optionValues: ProductOptionValue[]
	): string | undefined => {
		const optionValueId = currentOptions.find(
			(currentOption) => currentOption.optionId === optionId
		)?.optionValueId;

		return optionValues.find((optionValue) => optionValue.id === optionValueId)?.value;
	};

	const onSelectVariant = (optionId: number, optionValueId: number) => {
		const newOptions = currentOptions.map(
			(currOpt): VariantOptionDto =>
				currOpt.optionId === optionId ? { optionId, optionValueId } : currOpt
		);

		const slug = variants.find((variant) =>
			variant.optionValues.every((optionValue) =>
				newOptions.some(
					(newOpt) =>
						newOpt.optionId === optionValue.optionId &&
						newOpt.optionValueId === optionValue.optionValueId
				)
			)
		)?.slug;
	};

	const renderOptions = () => {
		return options.map((option) => {
			const currentOptionValueName = getCurrentOptionValueName(
				option.id,
				option.optionValues
			);

			return (
				<div key={option.value}>
					<div className="text-sm font-medium text-gray-700 mb-2">
						{option.value}: <b>{currentOptionValueName}</b>
					</div>
					<div className="flex flex-wrap gap-4">
						{option.optionValues.map((optionValue) => (
							<button
								key={optionValue.value}
								onClick={() => onChange(option.id, optionValue.id)}
								className={`flex items-center text-sm focus:outline-none border-2 rounded-md ${
									currentOptionValueName === optionValue.value
										? "border-blue-600"
										: "border-gray-300"
								}`}
							>
								{optionValue.imageUrl ? (
									<img
										src={optionValue.imageUrl}
										alt={optionValue.value}
										className="w-16 h-16 object-cover rounded-md"
									/>
								) : (
									<span className="py-1 px-2">{optionValue.value}</span>
								)}
							</button>
						))}
					</div>
				</div>
			);
		});
	};

	return (
		<div data-testid="product-option-selector-component" className="flex flex-col gap-4">
			{renderOptions()}
		</div>
	);
}
