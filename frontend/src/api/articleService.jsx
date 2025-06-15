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

	static async getArticleReactions(id) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");
		const response = await api.get(
			`${ArticleService.apibase}/reactions/${id}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}

	static async setArticleReaction(id, reaction) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");
		const response = await api.put(
			`${ArticleService.apibase}/reaction/${id}`,
			{ reaction },
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}

	static async updateArticle(id, body) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const modifiedBody = {
			title: body.title,
			description: body.description,
			category_id: body.category,
			...(body.imageFile && { img: body.imageFile }),
			removeImage: body.removeImage
		};

		const formData = new FormData();

		for (const field in modifiedBody) {
			formData.append(field, modifiedBody[field]);
		}

		const response = await api.patch(
			`${ArticleService.apibase}/${id}`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data"
				}
			}
		);

		return response;
	}
}

export default ArticleService;
