import { formatBigNumbers } from "../utils/utils";
import StarRating from "./StarRating";

interface ProductTitleProps {
	slug: string;
	quantitySold: number;
	rating: number;
	reviewCount: number;
}

export default function ProductTitle({
	slug,
	quantitySold,
	rating,
	reviewCount,
}: ProductTitleProps) {
	return (
		<div data-testid="product-title-component">
			<p className="text-sm text-muted">{formatBigNumbers(quantitySold)} vendidos</p>
			<h1 className="md:text-xl md:font-semibold mb-2 capitalize">
				{slug.split("-").join(" ")}
			</h1>
			<StarRating rating={rating} reviewCount={reviewCount} />
		</div>
	);
}
