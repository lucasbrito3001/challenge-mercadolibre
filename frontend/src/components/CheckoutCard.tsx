import { formatBigNumbers } from "../utils/utils";
import Button from "./Button";
import GeneralCard from "./GeneralCard";
import QuantitySelector from "./QuantitySelector";

interface CheckoutCardProps {
	quantity: number;
	storeIconUrl: string;
	isOfficialStore: boolean;
	storeName: string;
	storeSalesNumber: number;
}

export default function CheckoutCard({
	isOfficialStore,
	quantity,
	storeSalesNumber,
	storeIconUrl,
	storeName,
}: CheckoutCardProps) {
	return (
		<GeneralCard>
			<div data-testid="checkout-card-component">
				<p className="text-sm">
					<b className="text-green-500">Envio gratis</b> a todo el país
				</p>
				<p className="text-muted text-xs">Conoce los tiempos y las formas de envío</p>
				<a href="#" className="text-xs">
					Calcular cuando llega
				</a>
			</div>

			<div>
				<p className={`text-sm font-semibold ${quantity == 0 && "text-red-500"}`}>
					Stock {quantity ? "disponible" : "indisponible"}
				</p>
			</div>

			<div>
				<QuantitySelector maxQuantity={quantity} />
			</div>

			{quantity > 0 && (
				<div className="flex flex-col gap-2">
					<Button type="primary" isFullWidth text="Comprar ahora" />
					<Button type="secondary" isFullWidth text="Agregar al carrito" />
				</div>
			)}

			<div className="flex gap-2 items-center">
				{storeIconUrl && (
					<div className="w-12 h-12 border rounded flex items-center justify-center overflow-hidden">
						<img
							src={storeIconUrl}
							alt="logo tienda"
							className="max-w-full max-h-full object-contain"
						/>
					</div>
				)}
				<div className="text-sm">
					<div className="flex items-center gap-1">
						{isOfficialStore && <span>Tienda oficial</span>}
						<a href="#" className="text-blue-500">
							{storeName}
						</a>
						{isOfficialStore && (
							<img
								src="https://http2.mlstatic.com/frontend-assets/vpp-frontend/cockade.svg"
								alt="logo verificado"
								className="w-4 h-4"
							/>
						)}
					</div>
					<b>{formatBigNumbers(storeSalesNumber)} ventas</b>
				</div>
			</div>

			<div>
				<p className="text-sm text-muted">
					<a href="#">Devolución gratis.</a> Tienes 30 días desde que lo recibes.
				</p>
			</div>

			<div>
				<p className="text-sm text-muted">
					<a href="#">Compra protegida</a>, recibe el producto que esperabas o te devolvemos tu
					dinero.
				</p>
			</div>

			<div>
				<p className="text-sm text-muted">1 año de garantía de fábrica.</p>
			</div>
		</GeneralCard>
	);
}
