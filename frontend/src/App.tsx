import Header from "./components/Header";
import ProductDetails from "./pages/ProductDetails";
import { productDetailsService } from "./services/productDetailsService";

function App() {
	return (
		<div className="bg-gray-100 min-h-screen">
			<Header></Header>
			<ProductDetails productDetailsService={productDetailsService}></ProductDetails>
		</div>
	);
}

export default App;
