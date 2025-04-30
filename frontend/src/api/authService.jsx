import api from "./api";

class AuthService {
	static apibase = `/auth`;
	static getToken(type) {
		if (type === "access")
			return (
				localStorage.getItem("accessToken") ||
				sessionStorage.getItem("accessToken")
			);

		if (type === "refresh")
			return (
				localStorage.getItem("refreshToken") ||
				sessionStorage.getItem("refreshToken")
			);
	}

	static setTokens(accessToken, refreshToken, rememberMe = false) {
		if (rememberMe) {
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
		} else {
			sessionStorage.setItem("accessToken", accessToken);
			sessionStorage.setItem("refreshToken", refreshToken);
		}
	}

	static clearTokens() {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		sessionStorage.removeItem("accessToken");
		sessionStorage.removeItem("refreshToken");
	}

	static async login(userData, rememberMe = false) {
		const {
			data: { accessToken, refreshToken }
		} = await api.post(`${AuthService.apibase}/login`, userData);
		AuthService.setTokens(accessToken, refreshToken, rememberMe);
		return true;
	}

	static async getNewTokens() {
		const token = AuthService.getToken("refresh");
		if (!token) throw new Error("No refresh token available");

		const response = await api.get(`${AuthService.apibase}/refresh`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		const rememberMe = localStorage.getItem("refreshToken") !== null;
		const { accessToken, refreshToken } = response.data;

		this.setTokens(accessToken, refreshToken, rememberMe);

		return {
			accessToken,
			refreshToken
		};
	}

	static async me() {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.get(`${AuthService.apibase}/me`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		return response.data;
	}
}

export default AuthService;
