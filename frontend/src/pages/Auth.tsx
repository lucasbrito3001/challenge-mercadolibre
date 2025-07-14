import { useNavigate } from "react-router-dom";

export default function Auth() {
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const query = (form[0] as HTMLInputElement).value;

		if (typeof query === "string" && query.trim()) {
			navigate(`/${encodeURIComponent(query.trim())}`);
		}
	};

	return (
		<div className="flex items-center justify-center h-[92vh] bg-white text-center p-6">
			<div>
				<h1 className="text-3xl font-semibold text-gray-800 mb-4">Você está autenticado</h1>
				<p className="text-gray-600 mb-2">Busque algo</p>
				<div className="max-w-xl mx-auto mt-10">
					<form
						className="flex rounded-full border border-gray-300 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-yellow-400"
						onSubmit={handleSubmit}
					>
						<div className="relative flex-grow">
							<input
								type="text"
								placeholder="Buscar produtos, marcas e mais..."
								className="w-full pl-12 pr-4 py-3 focus:outline-none"
							/>

							<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
									/>
								</svg>
							</div>
						</div>

						<button
							type="submit"
							className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 transition"
						>
							Buscar
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
