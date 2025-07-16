interface Feature {
	key: string | null;
	value: string;
	iconUrl?: string | null;
}

interface ProductFeaturesProps {
	features: Feature[];
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
	const renderFeaturesWithIcon = () => {
		const featuresWithIcons: Feature[] = features.filter(
			(feature) => feature.iconUrl && feature.key
		);

		return featuresWithIcons.map((feature, idx) => (
			<li key={idx} className="text-sm md:text-xs flex items-center gap-2 col-span-2 md:col-span-1">
				<span className="bg-gray-100 rounded-full">
					<img src={feature.iconUrl || ""} className="w-[36px] h-[36px] p-2 object-contain"/>
				</span>{" "}
				{feature.key && `${feature.key}: `} <b>{feature.value}</b>
			</li>
		));
	};

	const renderFeaturesWithoutIcon = () => {
		const featuresWithoutIcons: Feature[] = features.filter(
			(feature) => !feature.iconUrl && feature.key
		);

		return featuresWithoutIcons.map((feature, idx) => (
			<tr className="odd:bg-gray-100" key={idx}>
				<td key={`${idx}-key`} className="text-sm md:text-xs p-4 max-w-3xs">
					<b>{feature.key}</b>
				</td>
				<td key={`${idx}-value`} className="text-sm md:text-xs p-4 max-w-3xs">
					{feature.value}
				</td>
			</tr>
		));
	};

	return (
		<section
			className="flex flex-col gap-4 py-4"
			id="features-section"
			data-testid="product-features-component"
		>
			<h2>Características del producto</h2>
			<ul className="grid grid-cols-2 gap-4">{renderFeaturesWithIcon()}</ul>
			<table className="space-y-2">
				<tbody>{renderFeaturesWithoutIcon()}</tbody>
			</table>
		</section>
	);
}
