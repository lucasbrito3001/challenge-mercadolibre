import httpClient from "./httpClient";

export const api = {
	get: <T>(url: string, params?: Record<string, any>) =>
		httpClient.get<T>(url, { params }).then((res) => res.data),
	post: <T>(url: string, data: any) => httpClient.post<T>(url, data).then((res) => res.data),
	put: <T>(url: string, data: any) => httpClient.put<T>(url, data).then((res) => res.data),
	delete: <T>(url: string) => httpClient.delete<T>(url).then((res) => res.data),
};
