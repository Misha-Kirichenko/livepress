import axios from "axios";
import AuthService from "./authService";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			originalRequest.url.includes("/auth/refresh")
		) {
			AuthService.clearTokens();
			window.location.href = "/login";
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const { accessToken } = await AuthService.getNewTokens();
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (err) {
				AuthService.clearTokens();
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
