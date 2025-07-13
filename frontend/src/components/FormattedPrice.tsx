import { formatMoney } from "../utils/utils";

interface FormattedPriceProps {
	valueInCents: number;
	size: "large" | "normal" | "small";
	isMuted: boolean;
}

export default function FormattedPrice({
	size = "normal",
	valueInCents,
	isMuted = false,
}: FormattedPriceProps) {
	const convertedAmount = valueInCents / 100;

	const textClassBySize = {
		large: "text-3xl font-light",
		normal: "text-md",
		small: "text-sm",
	};

	const textClass = textClassBySize[size];
	const mutedClass = "text-muted line-through";

	return (
		<span className={`${textClass} ${isMuted && mutedClass} inline-flex items-baseline`}>
			{formatMoney(convertedAmount)}
		</span>
	);
}
