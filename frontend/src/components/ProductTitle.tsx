import { formatBigNumbers } from "../utils/utils";
import StarRating from "./StarRating";

interface ProductTitleProps {
	title: string;
	quantitySold: number;
	rating: number;
	reviewCount: number;
}

export default function ProductTitle({
	title,
	quantitySold,
	rating,
	reviewCount,
}: ProductTitleProps) {
	return (
		<div data-testid="product-title-component">
			<p className="text-sm text-muted">{formatBigNumbers(quantitySold)} vendidos</p>
			<h1 className="md:text-xl md:font-semibold mb-2">{title}</h1>
			<StarRating rating={rating} reviewCount={reviewCount} />
		</div>
	);
}
