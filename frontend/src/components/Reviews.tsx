import StarRating from "./StarRating";

type ProductReviewProps = {
	reviews: {
		rating: number;
		comment: string;
		photos: string[];
	}[];
};

export default function ProductReview({ reviews }: ProductReviewProps) {
	return (
		<div>
			<h2 className="mb-8 block">Reseñas del producto</h2>
			<div className="flex flex-col gap-8">
				{reviews.map((review, index) => (
					<div key={index}>
						<div className="mb-2">
							<StarRating rating={review.rating}></StarRating>
						</div>
						{review.photos.length > 0 && (
							<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
								{review.photos.map((photoUrl, index) => (
									<img
										key={index}
										src={photoUrl}
										alt={`Foto ${index + 1}`}
										className="w-[64px] h-[64px] object-contain rounded-md rounded border"
									/>
								))}
							</div>
						)}
						<div className="mt-4 text-sm">{review.comment}</div>
					</div>
				))}
			</div>
		</div>
	);
}
