import api from "./api";
import AuthService from "./authService";

class CommentService {
	static apibase = `/comments`;
	static async getArticlesComments(article_id, queryParams) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");
		const { page, limit } = queryParams;

		const queryString = [
			page ? `page=${page}` : "",
			limit ? `limit=${limit}` : ""
		]
			.filter(Boolean)
			.join("&");

		const response = await api.get(
			`${CommentService.apibase}/${article_id}${
				queryString ? `?${queryString}` : ""
			}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}

	static async createArticleComment(article_id, body) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.post(
			`${CommentService.apibase}/${article_id}`,
			body,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}

	static async deleteArticleComment(commentId) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.delete(
			`${CommentService.apibase}/${commentId}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}

	static async updateArticleComment(commentId, body) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.patch(
			`${CommentService.apibase}/${commentId}`,
			body,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);

		return response;
	}
}

export default CommentService;
