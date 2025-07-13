import { cashIconsUrl, creditCardIconsUrl, debitCardIconsUrl } from "../utils/constants";
import GeneralCard from "./GeneralCard";
import card from "../assets/card.png";

export default function PaymentMethodsCard() {
	const renderPaymentMethods = (paymentMethodsUrl: string[], paymentMethod: string) => {
		return paymentMethodsUrl.map((url, idx) => (
			<div key={idx} data-testid={paymentMethod}>
				<img src={url} />
			</div>
		));
	};

	return (
		<GeneralCard>
			<div data-testid="payment-methods-card-component">
				<p>Medios de pago</p>
			</div>
			<div className="bg-green-500 rounded p-4 flex gap-2">
				<img width="16" height="16" src={card} alt="bank-card-back-side--v1" />
				<p className="text-white text-xs">
					¡Paga en <b>hasta 12 cuotas</b> sin interés!
				</p>
			</div>
			<div>
				<p className="text-sm">Tarjetas de crédito</p>
				<p className="text-xs text-muted">¡Cuotas sin interés con bancos seleccionados!</p>
				<div className="flex gap-3 mt-4">
					{renderPaymentMethods(creditCardIconsUrl, "credit-card")}
				</div>
			</div>

			<div>
				<p className="text-sm">Tarjetas de débito</p>
				<div className="flex gap-3 mt-4">
					{renderPaymentMethods(debitCardIconsUrl, "debit-card")}
				</div>
			</div>

			<div>
				<p className="text-sm">Efectivo</p>
				<div className="flex gap-3 mt-4">{renderPaymentMethods(cashIconsUrl, "cash")}</div>
			</div>

			<div>
				<a href="#" className="text-xs">
					Conoce otros medios de pago
				</a>
			</div>
		</GeneralCard>
	);
}
