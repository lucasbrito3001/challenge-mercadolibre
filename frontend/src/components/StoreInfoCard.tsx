import { onTimeDeliveryStatusIcon, serviceStatusIcon } from "../utils/constants";
import { formatBigNumbers } from "../utils/utils";
import Button from "./Button";
import GeneralCard from "./GeneralCard";
import StoreBanner from "./StoreBanner";

interface StoreInfoCardProps {
	iconUrl: string;
	bannerUrl: string;
	productsNumber: number;
	isOfficial: boolean;
	name: string;
	salesNumber: number;
	isPositiveService: boolean;
	isOnTimeDelivery: boolean;
	status: 1 | 2 | 3 | 4 | 5;
}

export default function StoreInfoCard({
	iconUrl,
	bannerUrl,
	productsNumber,
	isOfficial,
	name,
	salesNumber,
	isPositiveService,
	isOnTimeDelivery,
	status
}: StoreInfoCardProps) {
	return (
		<GeneralCard>
			<StoreBanner bannerUrl={bannerUrl} iconUrl={iconUrl}></StoreBanner>

			<div data-testid="store-info-card-component">
				<b>{name}</b>
				{isOfficial && (
					<div className="flex gap-2 text-xs text-muted">
						<img
							decoding="async"
							src="https://http2.mlstatic.com/frontend-assets/vpp-frontend/cockade.svg"
							alt="logo verificado"
						/>{" "}
						<p>Tienda oficial de Mercado Libre</p>
					</div>
				)}
				<p className="text-muted text-xs mt-2">
					<span className="text-black">{productsNumber}</span> Productos{" "}
				</p>
			</div>

			<div className="w-full flex gap-1 items-center">
				<div className={`${ status === 1 ? "opacity-100 h-2" : "opacity-30 h-1" } block w-1/5 bg-red-500`}></div>
				<div className={`${ status === 2 ? "opacity-100 h-2" : "opacity-30 h-1" } block w-1/5 bg-red-200`}></div>
				<div className={`${ status === 3 ? "opacity-100 h-2" : "opacity-30 h-1" } block w-1/5 bg-yellow-400`}></div>
				<div className={`${ status === 4 ? "opacity-100 h-2" : "opacity-30 h-1" } block w-1/5 bg-green-200`}></div>
				<div className={`${ status === 5 ? "opacity-100 h-2" : "opacity-30 h-1" } block w-1/5 bg-green-500`}></div>
			</div>

			<div className="flex flex-grow items-start">
				<div className="flex flex-col items-center text-center basis-1/3">
					<div className="h-10 flex items-center justify-center">
						<b>{formatBigNumbers(salesNumber)}</b>
					</div>
					<p className="text-xs text-muted">
						Ventas <br />
						concretadas
					</p>
				</div>

				<div className="flex flex-col items-center text-center basis-1/3">
					<div className="h-10 flex items-center justify-center">
						<img src={serviceStatusIcon[isPositiveService ? "positive" : "negative"]} />
					</div>
					<p className="text-xs text-muted">
						{isPositiveService ? "Brinda" : "No brinda"} buena <br />
						atención
					</p>
				</div>

				<div className="flex flex-col items-center text-center basis-1/3">
					<div className="h-10 flex items-center justify-center">
						<img src={onTimeDeliveryStatusIcon[isOnTimeDelivery ? "positive" : "negative"]} />
					</div>
					<p className="text-xs text-muted">
						{isOnTimeDelivery ? "Entrega" : "No entrega"} sus <br /> productos a <br /> tiempo
					</p>
				</div>
			</div>

			<div>
				<Button type="secondary" isFullWidth text="Ir a la tienda"></Button>
			</div>
		</GeneralCard>
	);
}
