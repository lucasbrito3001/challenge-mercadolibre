export default function Container({ children }: { children?: React.ReactNode }) {
	return <div className="max-w-6xl mx-auto bg-white rounded-md shadow-sm">{children}</div>;
}
