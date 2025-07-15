import { AlertTriangle } from "lucide-react";

export function NotFound() {
	return (
		<div
			className="flex flex-col items-center justify-center bg-gray-100 px-4 text-center h-[92vh]"
			data-testid="not-found-component"
		>
			<div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
				<div className="flex justify-center mb-4">
					<div className="bg-yellow-400 p-4 rounded-full">
						<AlertTriangle className="text-white w-8 h-8" />
					</div>
				</div>

				<h1 className="text-2xl font-semibold text-gray-800 mb-2">Ups, algo salió mal</h1>
				<p className="text-gray-600 mb-6">
					No pudimos encontrar el producto que buscas. Es posible que lo hayan eliminado o
					que nunca haya existido.
				</p>

				<button
					onClick={() => (window.location.href = "/")}
					className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg transition duration-200"
				>
					Regresar a la página de inicio
				</button>
			</div>
		</div>
	);
}
