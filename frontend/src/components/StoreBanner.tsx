interface StoreBannerProps {
	bannerUrl: string;
	iconUrl: string;
}

export default function StoreBanner({ bannerUrl, iconUrl }: StoreBannerProps) {
	const classWithBanner = "absolute top-[37px] left-[8px]";

	return (
		<div className="relative">
			{bannerUrl && (
				<div className="h-[84px]">
					<img
						src={bannerUrl}
						data-testid="banner-img"
						className="h-full w-full rounded object-cover"
					/>
				</div>
			)}

			{iconUrl && (
				<div
					className={`${
						bannerUrl ? classWithBanner : ""
					} w-[56px] h-[56px] bg-white border rounded flex items-center justify-center overflow-hidden`}
				>
					<img
						src={iconUrl}
						alt="logo tienda"
						data-testid="icon-img"
						className="max-w-full max-h-full object-contain"
					/>
				</div>
			)}
		</div>
	);
}
