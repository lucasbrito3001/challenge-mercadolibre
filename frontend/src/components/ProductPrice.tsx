import { calcOfferPercentage } from "../utils/utils";
import FormattedPrice from "./FormattedPrice";

interface ProductPriceProps {
	isOfferEnabled: boolean;
	price: number;
	offerPrice?: number;
}

export default function ProductPrice({ isOfferEnabled, offerPrice, price }: ProductPriceProps) {
	const isOfferValid = isOfferEnabled && offerPrice;
	return (
		<div data-testid="product-price-component">
			{isOfferEnabled && (
				<s className="text-xs text-muted">
					<FormattedPrice valueInCents={price} size="small" isMuted={true} />
				</s>
			)}
			<p className="text-3xl font-light flex items-center gap-2">
				<FormattedPrice
					valueInCents={isOfferValid ? offerPrice : price}
					size="large"
					isMuted={false}
				/>
				{isOfferValid && (
					<span className="text-sm text-green-500">
						{calcOfferPercentage(price, offerPrice)}% OFF
					</span>
				)}
			</p>
			<p>
				en{" "}
				<span className="text-green-500">
					10 cuotas de{" "}
					<FormattedPrice
						valueInCents={(isOfferValid ? offerPrice : price) / 10}
						size="normal"
						isMuted={false}
					/>{" "}
					sin interés
				</span>
			</p>
			<a href="#" className="text-xs">
				Ver medios de pago y promociones
			</a>
		</div>
	);
}
