import api from "./api";
import AuthService from "./authService";

class AdminService {
	static apibase = "/admin";

	static async toggleBlockUser(nickName, body) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");

		const response = await api.patch(
			`${AdminService.apibase}/block/${nickName}`,
			body,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		return response;
	}
}

export default AdminService;
