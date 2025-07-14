import axios from "axios";

const httpClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost/api/v1",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

httpClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.warn("Unauthorized");
			window.location.href = "/auth";
		}
		return Promise.reject(error);
	}
);

export default httpClient;
