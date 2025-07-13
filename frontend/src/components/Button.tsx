export default function Button({
	type,
	isFullWidth,
	text,
}: {
	type: "primary" | "secondary";
	isFullWidth: boolean;
	text: string;
}) {
	const buttonClassDict = {
		primary: "bg-blue-500 text-white",
		secondary: "bg-blue-100 text-blue-500",
	};

	const buttonWidth = {
		full: "w-full",
		notFull: "w-[256px]",
	};

	const buttonClass = buttonClassDict[type];
	const buttonWidthClass = isFullWidth ? buttonWidth.full : buttonWidth.notFull;

	return <button className={`block rounded text-sm py-3 ${buttonWidthClass} ${buttonClass}`}>{text}</button>;
}
