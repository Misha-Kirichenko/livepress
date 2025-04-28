import api from "./api";
import AuthService from "./authService";

class CategoryService {
	static apibase = `/categories`;
	static async getUserSubscriptions() {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.get(`${CategoryService.apibase}/subscriptions`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		return response;
	}
	static async getAllCategories() {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.get(`${CategoryService.apibase}`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		return response;
	}

	static async toggleSubscription(category_id) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.put(
			`${CategoryService.apibase}/toggle-subscription/${category_id}`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}
}

export default CategoryService;
