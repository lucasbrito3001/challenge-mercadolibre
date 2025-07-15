import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductReview from "../Reviews";

vi.mock("../StarRating", () => ({
	default: vi.fn(({ rating }) => (
		<div data-testid={`mock-star-rating-${rating}`}>Rating: {rating}</div>
	)),
}));

describe("ProductReview Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the "Reseñas del producto" heading', () => {
		render(<ProductReview reviews={[]} />);
		expect(screen.getByText("Reseñas del producto")).toBeInTheDocument();
	});

	it("should render no reviews when the reviews array is empty", () => {
		render(<ProductReview reviews={[]} />);
		expect(screen.queryAllByTestId(/mock-star-rating-/)).toHaveLength(0);
		expect(screen.queryByText("mt-4 text-sm")).not.toBeInTheDocument();
	});

	it("should render multiple reviews correctly, including ratings and comments", () => {
		const mockReviews = [
			{ rating: 4, comment: "Excelente producto, muy recomendado.", photos: [] },
			{ rating: 2, comment: "No cumplió mis expectativas.", photos: [] },
			{ rating: 5, comment: "Increíble, me encanta!", photos: [] },
		];

		render(<ProductReview reviews={mockReviews} />);

		expect(screen.getByTestId("mock-star-rating-4")).toBeInTheDocument();
		expect(screen.getByTestId("mock-star-rating-2")).toBeInTheDocument();
		expect(screen.getByTestId("mock-star-rating-5")).toBeInTheDocument();

		expect(screen.getByText("Excelente producto, muy recomendado.")).toBeInTheDocument();
		expect(screen.getByText("No cumplió mis expectativas.")).toBeInTheDocument();
		expect(screen.getByText("Increíble, me encanta!")).toBeInTheDocument();
	});

	it("should render review photos when provided", () => {
		const mockReviewsWithPhotos = [
			{
				rating: 5,
				comment: "Fotos reales del producto, tal cual la descripción.",
				photos: ["http://example.com/photo1.jpg", "http://example.com/photo2.jpg"],
			},
		];

		render(<ProductReview reviews={mockReviewsWithPhotos} />);

		const photosContainer = screen.getByText(
			"Fotos reales del producto, tal cual la descripción."
		).previousElementSibling;
		expect(photosContainer).toBeInTheDocument();
		expect(photosContainer).toHaveStyle("display: flex");
		expect(photosContainer).toHaveStyle("gap: 8px");

		const img1 = screen.getByAltText("Foto 1") as HTMLImageElement;
		expect(img1).toBeInTheDocument();
		expect(img1).toHaveAttribute("src", "http://example.com/photo1.jpg");
		expect(img1).toHaveClass("w-[64px]");
		expect(img1).toHaveClass("h-[64px]");

		const img2 = screen.getByAltText("Foto 2") as HTMLImageElement;
		expect(img2).toBeInTheDocument();
		expect(img2).toHaveAttribute("src", "http://example.com/photo2.jpg");
	});

	it("should not render photos div if photos array is empty", () => {
		const mockReviewNoPhotos = [{ rating: 3, comment: "Producto regular.", photos: [] }];

		render(<ProductReview reviews={mockReviewNoPhotos} />);

		expect(screen.queryByAltText(/Foto/)).not.toBeInTheDocument();

		const commentElement = screen.getByText("Producto regular.");
		const reviewDiv = commentElement.closest("div");
	});
});
