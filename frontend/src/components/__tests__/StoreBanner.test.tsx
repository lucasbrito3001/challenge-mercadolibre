import { render, screen } from "@testing-library/react";
import StoreBanner from "../StoreBanner";
import { describe, it, expect } from "vitest";

describe("StoreBanner Component", () => {
	const bannerUrl = "https://example.com/banner.jpg";
	const iconUrl = "https://example.com/icon.png";

	it("renders both banner and icon when both URLs are provided", () => {
		render(<StoreBanner bannerUrl={bannerUrl} iconUrl={iconUrl} />);

		const bannerImage = screen.getByRole("img", { name: "" });
		const iconImage = screen.getByAltText("logo tienda");

		expect(bannerImage).toHaveAttribute("src", bannerUrl);
		expect(iconImage).toHaveAttribute("src", iconUrl);
	});

	it("renders only the icon when bannerUrl is not provided", () => {
		render(<StoreBanner bannerUrl={""} iconUrl={iconUrl} />);

		const iconImage = screen.getByTestId("icon-img");
		const bannerImage = screen.queryByTestId("banner-img");

		expect(iconImage).toBeInTheDocument();
		expect(bannerImage).not.toBeInTheDocument();
	});

	it("renders only the banner when iconUrl is not provided", () => {
		render(<StoreBanner bannerUrl={bannerUrl} iconUrl={""} />);

		const iconImage = screen.queryByTestId("icon-img");
		const bannerImage = screen.getByTestId("banner-img");

		expect(bannerImage).toBeInTheDocument();
		expect(iconImage).not.toBeInTheDocument();
	});

	it("renders nothing when both bannerUrl and iconUrl are missing", () => {
		render(<StoreBanner bannerUrl={""} iconUrl={""} />);

		const iconImage = screen.queryByTestId("icon-img");
		const bannerImage = screen.queryByTestId("banner-img");

		expect(bannerImage).not.toBeInTheDocument();
		expect(iconImage).not.toBeInTheDocument();
	});

	it("applies positioning class to the icon when banner is present", () => {
		const { container } = render(<StoreBanner bannerUrl={bannerUrl} iconUrl={iconUrl} />);
		const positionedIcon = container.querySelector("div.absolute.top-\\[37px\\].left-\\[8px\\]");
		expect(positionedIcon).toBeInTheDocument();
	});

	it("does not apply positioning class to icon when banner is missing", () => {
		const { container } = render(<StoreBanner bannerUrl={""} iconUrl={iconUrl} />);
		const positionedIcon = container.querySelector("div.absolute.top-\\[37px\\].left-\\[8px\\]");
		expect(positionedIcon).not.toBeInTheDocument();
	});
});
