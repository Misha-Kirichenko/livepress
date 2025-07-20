const { Router } = require("express");
const router = Router();
const { statusCodeMessage } = require("@utils");
const MESSAGES = require("@constants/messages");
const {
	verifyTokenMiddleware,
	checkIsBlockedMiddleware
} = require("@middlewares/auth");
const { notificationService } = require("@services/api/notification");

router.get(
	"/",
	[verifyTokenMiddleware("access"), checkIsBlockedMiddleware],
	async (req, res) => {
		try {
			let answer = [];
			const { role, id: user_id } = req.user;
			switch (role) {
				case "ADMIN":
					answer = await notificationService.getAllAdminNotifications(user_id);
					break;
				case "USER":
					answer = await notificationService.getAllUserNotifications(user_id);
					break;
				default:
					return res.status(403).send({ message: MESSAGES.ERRORS.FORBIDDEN });
			}
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/by-article/:article_id",
	[verifyTokenMiddleware("access"), checkIsBlockedMiddleware],
	async (req, res) => {
		try {
			const { article_id } = req.params;
			const { role, id: user_id } = req.user;
			switch (role) {
				case "ADMIN":
					await notificationService.removeAdminNotificationByArticle(
						user_id,
						article_id
					);
					break;
				case "USER":
					await notificationService.removeUserNotificationByArticle(
						user_id,
						article_id
					);
					break;
				default:
					return res.status(403).send({ message: MESSAGES.ERRORS.FORBIDDEN });
			}
			return res.status(204).send();
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/:notif_id",
	[verifyTokenMiddleware("access"), checkIsBlockedMiddleware],
	async (req, res) => {
		try {
			const { notif_id } = req.params;
			const { role, id: user_id } = req.user;
			switch (role) {
				case "ADMIN":
					await notificationService.removeAdminNotification(user_id, notif_id);
					break;
				case "USER":
					await notificationService.removeUserNotification(user_id, notif_id);
					break;
				default:
					return res.status(403).send({ message: MESSAGES.ERRORS.FORBIDDEN });
			}
			return res.status(204).send();
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
