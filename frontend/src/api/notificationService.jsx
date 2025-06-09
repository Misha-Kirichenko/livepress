import api from "./api";
import AuthService from "./authService";

class NotificationService {
	static apibase = `/notifications`;
	static async getAll() {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");
		const response = await api.get(NotificationService.apibase, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}
	static async markAsRead(notif_id) {
		const token = AuthService.getToken("access");
		if (!token) throw new Error("No access token available");
		const response = await api.delete(
			`${NotificationService.apibase}/${notif_id}`,
			{
				headers: { Authorization: `Bearer ${token}` }
			}
		);
		return response;
	}
}

export default NotificationService;
