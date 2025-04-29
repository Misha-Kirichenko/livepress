import api from "./api";
import AuthService from "./authService";

class ArticleService {
	static apibase = `/article`;
	static async getArticles(queryParams) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");
		const { page, limit, search, category_id } = queryParams;

		const queryString = [
			page ? `page=${page}` : "",
			limit ? `limit=${limit}` : "",
			search ? `search=${search}` : "",
			category_id ? `category_id=${category_id}` : ""
		]
			.filter(Boolean)
			.join("&");

		const response = await api.get(
			`${ArticleService.apibase}/my-list${
				queryString ? `?${queryString}` : ""
			}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}

	static async getArticle(id) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");
		const response = await api.get(`${ArticleService.apibase}/${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});

		return response;
	}
}

export default ArticleService;
