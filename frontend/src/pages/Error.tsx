import { AlertTriangle } from "lucide-react";

export default function Error() {
	return (
		<div className="bg-yellow-50 flex items-center justify-center h-[92vh] p-6">
			<div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
				<div className="flex justify-center mb-4">
					<div className="bg-yellow-400 p-4 rounded-full">
						<AlertTriangle className="text-white w-8 h-8" />
					</div>
				</div>

				<h1 className="text-4xl font-bold text-gray-800 mb-4">Ups, algo salió mal</h1>
				<p className="text-gray-600 mb-6">
					Se produjo un error interno del servidor. Estamos trabajando para resolverlo lo
					antes posible.
				</p>
				<a
					href="/"
					className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full transition"
				>
					Regresar a la página de inicio
				</a>
			</div>
		</div>
	);
}
