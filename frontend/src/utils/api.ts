import httpClient from "./httpClient";

type ApiResponse<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: any;
	  };

export const api = {
	get: async <T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
		try {
			const response = await httpClient.get<T>(url, { params });
			return { success: true, data: response.data };
		} catch (error) {
			return { success: false, error };
		}
	},

	post: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
		try {
			const response = await httpClient.post<T>(url, data);
			return { success: true, data: response.data };
		} catch (error) {
			return { success: false, error };
		}
	},

	put: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
		try {
			const response = await httpClient.put<T>(url, data);
			return { success: true, data: response.data };
		} catch (error) {
			return { success: false, error };
		}
	},

	delete: async <T>(url: string): Promise<ApiResponse<T>> => {
		try {
			const response = await httpClient.delete<T>(url);
			return { success: true, data: response.data };
		} catch (error) {
			return { success: false, error };
		}
	},
};
