interface ProductOption {
	value: string;
	imageUrl: string;
	key: string;
}

interface ProductOptionSelectorProps {
	title: string;
	options: ProductOption[];
}

export default function ProductOptionSelector({ title, options }: ProductOptionSelectorProps) {
	const getSelectedFromUrl = (): string | undefined => {
		const path = window.location.pathname;
		if (!path || path === "/") return undefined;
		return path.slice(1);
	};

	const [selectedKey, selectedText] = (() => {
		const keyFromUrl = getSelectedFromUrl();
		const optionSelected = options.find((o) => o.key === keyFromUrl);

		if (keyFromUrl && optionSelected) {
			return [optionSelected.key, optionSelected.value];
		}
		return [options[0]?.key, options[0]?.value];
	})();

	function handleSelect(key: string) {
		window.location.href = `/${key}`;
	}

	return (
		<div data-testid="product-option-selector-component">
			<div className="text-sm font-medium text-gray-700 mb-2">
				{title}: <b>{selectedText}</b>
			</div>
			<div className="flex gap-4 flex-wrap">
				{options.map((option) => (
					<button
						key={option.key}
						onClick={() => handleSelect(option.key)}
						className="flex flex-col items-center text-sm focus:outline-none rounded-md"
					>
						<img
							src={option.imageUrl}
							alt={option.value}
							className={`w-16 h-16 object-cover border-2 rounded-md ${
								selectedKey === option.key ? "border-blue-600" : "border-gray-300"
							}`}
						/>
					</button>
				))}
			</div>
		</div>
	);
}
