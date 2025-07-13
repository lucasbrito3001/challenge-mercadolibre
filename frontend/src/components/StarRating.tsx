interface StarRatingProps {
	rating: number;
	reviewCount: number;
	max?: number;
}

export default function StarRating({ rating, max = 5, reviewCount }: StarRatingProps) {
	let fullStars: number = Math.floor(rating);
	let hasHalfStar: boolean = false;
	const stars = [];

	if (rating % 1 >= 0.25 && rating % 1 <= 0.75) {
		hasHalfStar = true;
	} else if (rating % 1 > 0.75) {
		fullStars += 1;
	}

	for (let i = 0; i < max; i++) {
		if (i < fullStars) {
			stars.push(<FullStar key={i} />);
		} else if (i === fullStars && hasHalfStar) {
			stars.push(<HalfStar key={i} />);
		} else {
			stars.push(<EmptyStar key={i} />);
		}
	}

	return (
		<div className="flex gap-1">
			<span className="text-muted text-sm">{rating}</span> {stars}{" "}
			<span className="text-muted text-sm">({reviewCount})</span>
		</div>
	);
}

const starStyle = {
	width: "16px",
	height: "16px",
	fill: "#2563EB",
	stroke: "#2563EB",
	strokeWidth: "1.2",
};

const FullStar = () => (
	<svg viewBox="0 0 24 24" style={starStyle} data-testid="full-star">
		<path d="M12 2l2.9 7.4H23l-5.9 4.6L18.8 22 12 17.6 5.2 22l1.7-8L1 9.4h8.1L12 2z" />
	</svg>
);

const HalfStar = () => (
	<svg viewBox="0 0 24 24" style={starStyle} data-testid="half-star">
		<defs>
			<linearGradient id="halfGradient">
				<stop offset="50%" stopColor="#2563EB" />
				<stop offset="50%" stopColor="white" stopOpacity="1" />
			</linearGradient>
		</defs>
		<path
			d="M12 2l2.9 7.4H23l-5.9 4.6L18.8 22 12 17.6 5.2 22l1.7-8L1 9.4h8.1L12 2z"
			fill="url(#halfGradient)"
			stroke="#2563EB"
			strokeWidth="1.2"
		/>
	</svg>
);

const EmptyStar = () => (
	<svg viewBox="0 0 24 24" style={{ ...starStyle, fill: "none" }} data-testid="empty-star">
		<path d="M12 2l2.9 7.4H23l-5.9 4.6L18.8 22 12 17.6 5.2 22l1.7-8L1 9.4h8.1L12 2z" />
	</svg>
);
