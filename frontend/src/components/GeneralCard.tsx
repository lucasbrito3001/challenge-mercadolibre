interface GeneralCardProps {
	children?: React.ReactNode;
	className?: string;
}

export default function GeneralCard({ children, className }: GeneralCardProps) {
	return (
		<div className={`border-0 md:border rounded p-0 md:p-4 flex flex-col gap-4 ${className}`}>
			{children}
		</div>
	);
}
