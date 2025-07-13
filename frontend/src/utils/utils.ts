export const formatMoney = (value: number) => {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		currencyDisplay: "symbol",
	});
};

export const calcOfferPercentage = (originalValue: number, offerValue: number) => {
	const offerPercentage = ((originalValue - offerValue) / originalValue) * 100;

	return Math.floor(offerPercentage);
};

export const formatBigNumbers = (number: number) => {
	const isThousands = number >= 1000;

	if (!isThousands) return `${number}`;

	return `+${Math.floor(number / 1000)}mil`;
};
