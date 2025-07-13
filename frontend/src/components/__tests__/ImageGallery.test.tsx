// src/components/__tests__/ImageGallery.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ImageGallery from "../ImageGallery";

const images = [
	"https://example.com/image1.jpg",
	"https://example.com/image2.jpg",
	"https://example.com/image3.jpg",
];

function swipeLeft(element: HTMLElement) {
	fireEvent.touchStart(element, { touches: [{ clientX: 200 }] });
	fireEvent.touchMove(element, { touches: [{ clientX: 50 }] });
	fireEvent.touchEnd(element, { changedTouches: [{ clientX: 50 }] });
}

function swipeRight(element: HTMLElement) {
	fireEvent.touchStart(element, { touches: [{ clientX: 50 }] });
	fireEvent.touchMove(element, { touches: [{ clientX: 200 }] });
	fireEvent.touchEnd(element, { changedTouches: [{ clientX: 200 }] });
}

const resizeWindow = (width: number) => {
	(window as any).innerWidth = width;
	window.dispatchEvent(new Event("resize"));
};

describe("ImageGallery Component", () => {
	beforeEach(() => {
		resizeWindow(1024); // default desktop width
	});

	afterAll(() => {
		resizeWindow(1024);
	});

	describe("Desktop layout (width >= 640px)", () => {
		beforeEach(() => {
			resizeWindow(1024);
		});

		it("shows thumbnails and main image", () => {
			render(<ImageGallery images={images} />);
			const thumbnails = screen
				.getAllByRole("img")
				.filter((img) => images.includes(img.getAttribute("src") || ""));

			expect(thumbnails.length).toBe(images.length + 1);
			expect(screen.queryByText("1 / 3")).not.toBeInTheDocument();
		});

		it("changes main image when thumbnail is clicked", () => {
			render(<ImageGallery images={images} />);
			const thumbnails = screen
				.getAllByRole("img")
				.filter((img) => images.includes(img.getAttribute("src") || ""));
			fireEvent.click(thumbnails[1]);
			const mainImage = screen
				.getAllByRole("img")
				.find((img) => img.getAttribute("src") === images[1]);
			expect(mainImage).toBeDefined();
		});
	});

	describe("Mobile layout (width < 640px)", () => {
		beforeEach(() => {
			resizeWindow(375);
		});

		it("shows counter and bullets", () => {
			render(<ImageGallery images={images} />);
			expect(screen.getByText("1 / 3")).toBeInTheDocument();
			const bullets = screen.getAllByRole("button");
			expect(bullets.length).toBe(images.length);
		});

		it("changes image when bullet clicked", () => {
			render(<ImageGallery images={images} />);
			const bullets = screen.getAllByRole("button");
			fireEvent.click(bullets[2]);
			const mainImage = screen
				.getAllByRole("img")
				.find((img) => img.getAttribute("src") === images[2]);
			expect(mainImage).toBeDefined();
		});

		it("allows swipe left and right to change images", () => {
			render(<ImageGallery images={images} />);
			const mobileImageContainer = screen.getByTestId("swipeable-img").parentElement as HTMLElement;

			swipeLeft(mobileImageContainer);
			let updatedImage = screen.getByTestId("swipeable-img").getAttribute("src") === images[1];
			expect(updatedImage).toBeDefined();

			swipeRight(mobileImageContainer);
			updatedImage = screen.getByTestId("swipeable-img").getAttribute("src") === images[0];
			expect(updatedImage).toBeDefined();
		});
	});
});
