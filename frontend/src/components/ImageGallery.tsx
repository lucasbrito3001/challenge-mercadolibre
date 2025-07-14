import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import useIsDesktop from "../hooks/breakpoint";

interface ImageGalleryProps {
	images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const isDesktop = useIsDesktop();

	const goTo = (idx: number) => {
		if (idx >= 0 && idx < images.length) {
			setSelectedIndex(idx);
		}
	};

	const handlers = useSwipeable({
		onSwipedLeft: () => goTo(selectedIndex + 1),
		onSwipedRight: () => goTo(selectedIndex - 1),
		trackMouse: true,
	});

	return (
		<div
			data-testid="image-gallery-component"
			className="flex flex-col md:flex-row gap-4 items-center md:items-start"
		>
			{isDesktop && (
				<div className="hidden md:flex flex-col gap-2">
					{images.map((img, idx) => (
						<img
							key={idx}
							src={img}
							className={`w-16 h-12 object-contain cursor-pointer rounded-sm border ${
								selectedIndex === idx ? "ring-2 ring-blue-600" : ""
							}`}
							onClick={() => setSelectedIndex(idx)}
							data-testid="desktop-img"
						/>
					))}
				</div>
			)}

			<div className="w-full md:w-auto flex flex-col items-center md:items-start">
				{!isDesktop && (
					<div className="w-full mb-1 flex justify-start">
						<span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
							<b>
								{selectedIndex + 1} / {images.length}
							</b>
						</span>
					</div>
				)}

				{isDesktop && (
					<img
						src={images[selectedIndex]}
						className="md:block w-[400px] h-[400px] object-contain rounded-md"
						data-testid="desktop-img"
					/>
				)}

				{!isDesktop && (
					<div className="w-full max-w-xs relative" {...handlers}>
						<img
							src={images[selectedIndex]}
							className="w-full h-72 object-contain rounded-md"
							data-testid="swipeable-img"
						/>
					</div>
				)}

				{!isDesktop && (
					<div className="mt-2 flex justify-center gap-2">
						{images.map((_, idx) => (
							<button
								key={idx}
								className={`w-2.5 h-2.5 rounded-full transition-all ${
									idx === selectedIndex ? "bg-blue-600" : "bg-gray-300"
								}`}
								onClick={() => setSelectedIndex(idx)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
