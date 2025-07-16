import Container from "../components/Container";
import ImageGallery from "../components/ImageGallery";
import ProductOptionSelector from "../components/ProductOptionSelector";
import ProductTitle from "../components/ProductTitle";
import ProductPrice from "../components/ProductPrice";
import CheckoutCard from "../components/CheckoutCard";
import StoreInfoCard from "../components/StoreInfoCard";
import PaymentMethodsCard from "../components/PaymentMethodsCard";
import ProductFeaturesMinified from "../components/ProductFeaturesMinified";
import ProductFeatures from "../components/ProductFeatures";
import ProductDescription from "../components/ProductDescription";
import useIsDesktop from "../hooks/breakpoint";
import { useEffect, useState } from "react";
import type { ProductDetails, VariantOptionDto } from "../types/ProductDetails";
import { productDetailsService } from "../services/productDetailsService";
import { useNavigate } from "react-router-dom";
import ProductReview from "../components/Reviews";

interface ProductDetailsProps {
	productDetailsService: typeof productDetailsService;
}

export default function ProductDetails({ productDetailsService }: ProductDetailsProps) {
	const navigate = useNavigate();
	const isDesktop = useIsDesktop();
	const productSlug = window.location.pathname.slice(1);

	const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function loadProductDetails() {
			const productDetails = await productDetailsService.getById(productSlug);

			if (productDetails === null) navigate("not-found");

			setProductDetails(productDetails);
			setIsLoading(false);
		}

		loadProductDetails();
	}, []);

	const changeProductVariant = async (optionId: number, optionValueId: number): Promise<void> => {
		if (productDetails === null) {
			window.location.href = "error";
			return;
		}

		const newOptions = productDetails?.variantOptions.map(
			(currOpt): VariantOptionDto =>
				currOpt.optionId === optionId
					? { optionId: currOpt.optionId, optionValueId }
					: { optionId: currOpt.optionId, optionValueId: currOpt.optionValueId }
		);

		const slug = productDetails.variants.find((variant) =>
			variant.optionValues.every((optionValue) =>
				newOptions.some(
					(newOpt) =>
						newOpt.optionId === optionValue.optionId &&
						newOpt.optionValueId === optionValue.optionValueId
				)
			)
		)?.slug;

		if (!slug) {
			const nextMatchSlug = productDetails.variants.find((variant) =>
				variant.optionValues.some(
					(optionValue) =>
						optionId === optionValue.optionId &&
						optionValueId === optionValue.optionValueId
				)
			)?.slug;

			window.location.href = nextMatchSlug ?? "error";
			return;
		}

		window.location.href = slug;

		return;
	};

	return (
		<div>
			{!isLoading && productDetails && (
				<div className="py-12">
					<Container>
						{/* Mobile version */}
						{!isDesktop && (
							<div className="flex flex-col gap-8 p-4">
								<ProductTitle
									title={productDetails.title}
									quantitySold={productDetails.quantitySold}
									rating={productDetails.rating}
									reviewCount={productDetails.reviewCount}
								/>
								<ImageGallery images={productDetails.imageUrlList} />
								<ProductOptionSelector
									onChange={changeProductVariant}
									currentOptions={productDetails.variantOptions}
									options={productDetails.options}
								/>
								<ProductPrice
									isOfferEnabled={!!productDetails.offer}
									offerPrice={productDetails.offer?.price}
									price={productDetails.price}
								/>
								<CheckoutCard
									isOfficialStore={productDetails.store.isOfficial}
									quantity={productDetails.quantity}
									storeSalesNumber={productDetails.store.salesNumber}
									storeIconUrl={productDetails.store.iconUrl}
									storeName={productDetails.store.name}
								/>
								<hr />
								<ProductFeaturesMinified
									features={productDetails.features}
									maxItems={4}
								/>
								<hr />
								<ProductFeatures features={productDetails.features} />
								<hr />
								<StoreInfoCard
									status={productDetails.store.status}
									iconUrl={productDetails.store.iconUrl}
									bannerUrl={productDetails.store.bannerUrl}
									productsNumber={productDetails.store.productsNumber}
									isOfficial={productDetails.store.isOfficial}
									name={productDetails.store.name}
									salesNumber={productDetails.store.salesNumber}
									isPositiveService={productDetails.store.isPositiveService}
									isOnTimeDelivery={productDetails.store.isOnTimeDelivery}
								/>
								<hr />
								<ProductDescription text={productDetails.description} />
								<hr />
								{productDetails.reviews && (
									<>
										<ProductReview reviews={productDetails.reviews} />
										<hr />
									</>
								)}
								<PaymentMethodsCard />
							</div>
						)}

						{/* Desktop version */}
						{isDesktop && (
							<div className="md:grid grid-cols-10">
								<main className="col-span-7 flex flex-col p-4 gap-8">
									<div className="flex gap-4">
										<div className="w-1/2">
											<ImageGallery images={productDetails.imageUrlList} />
										</div>
										<div className="w-1/2 flex flex-col gap-8">
											<ProductTitle
												title={productDetails.title}
												quantitySold={productDetails.quantitySold}
												rating={productDetails.rating}
												reviewCount={productDetails.reviewCount}
											/>
											<ProductPrice
												isOfferEnabled={!!productDetails.offer}
												offerPrice={productDetails.offer?.price}
												price={productDetails.price}
											/>
											<ProductOptionSelector
												onChange={changeProductVariant}
												currentOptions={productDetails.variantOptions}
												options={productDetails.options}
											/>
											<ProductFeaturesMinified
												features={productDetails.features}
												maxItems={4}
											/>
										</div>
									</div>
									<hr />
									<ProductFeatures features={productDetails.features} />
									<hr />
									<ProductDescription text={productDetails.description} />
									{productDetails.reviews && (
										<>
											<hr />
											<ProductReview reviews={productDetails.reviews} />
										</>
									)}
								</main>
								<aside className="col-span-3 py-4 pr-4 flex flex-col gap-4">
									<CheckoutCard
										isOfficialStore={productDetails.store.isOfficial}
										quantity={productDetails.quantity}
										storeSalesNumber={productDetails.store.salesNumber}
										storeIconUrl={productDetails.store.iconUrl}
										storeName={productDetails.store.name}
									/>
									<StoreInfoCard
										status={productDetails.store.status}
										iconUrl={productDetails.store.iconUrl}
										bannerUrl={productDetails.store.bannerUrl}
										productsNumber={productDetails.store.productsNumber}
										isOfficial={productDetails.store.isOfficial}
										name={productDetails.store.name}
										salesNumber={productDetails.store.salesNumber}
										isPositiveService={productDetails.store.isPositiveService}
										isOnTimeDelivery={productDetails.store.isOnTimeDelivery}
									/>
									<PaymentMethodsCard />
								</aside>
							</div>
						)}
					</Container>
				</div>
			)}
		</div>
	);
}
