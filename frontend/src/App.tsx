import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProductDetails from "./pages/ProductDetails";
import { productDetailsService } from "./services/productDetailsService";
import Error from "./pages/Error";
import { NotFound } from "./pages/NotFound";
import Search from "./pages/Search";

function App() {
	return (
		<div className="bg-gray-100 min-h-screen">
			<Header></Header>
			<Routes>
				<Route path="/" element={<Search />} />
				<Route path="/error" element={<Error />} />
				<Route path="/not-found" element={<NotFound />} />
				<Route
					path="/:slug"
					element={<ProductDetails productDetailsService={productDetailsService} />}
				/>
				<Route path="*" element={<Navigate to="/not-found" />} />
			</Routes>
		</div>
	);
}

export default App;
