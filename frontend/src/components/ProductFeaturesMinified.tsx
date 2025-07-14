interface ProductFeaturesMinifiedProps {
	features: { key: string | null; value: string }[];
	maxItems: number;
}

export default function ProductFeaturesMinified({
	features,
	maxItems,
}: ProductFeaturesMinifiedProps) {
	const renderFeaturesListItem = () => {
		let featuresToShow = [];

		for (let idx = 0; idx < Math.min(maxItems, features.length); idx++) {
			featuresToShow.push(
				<li key={idx} className="text-sm md:text-xs">
					{features[idx].key && `${features[idx].key}: `} {features[idx].value}
				</li>
			);
		}

		return featuresToShow;
	};

	return (
		<div className="flex flex-col gap-4" data-testid="product-features-minified-component">
			<p className="md:text-xs font-normal md:font-semibold block">
				Lo que tienes que saber de este producto
			</p>
			<ul className="list-disc list-inside space-y-2">{renderFeaturesListItem()}</ul>
			<a href="#features-section" className="text-sm md:text-xs">
				Ver características
			</a>
		</div>
	);
}
