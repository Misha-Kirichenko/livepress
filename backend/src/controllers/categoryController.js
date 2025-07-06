const { Router } = require("express");
const router = Router();
const { statusCodeMessage, MESSAGE_UTIL } = require("@utils");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware,
	checkIsBlockedMiddleware
} = require("@middlewares/auth");
const { categoryService } = require("@services/api/category");

router.get(
	"/",
	[verifyTokenMiddleware("access"), checkIsBlockedMiddleware],
	async (req, res) => {
		try {
			const categories = await categoryService.getAll();
			return res.send(categories);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.put(
	"/toggle-subscription/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(["USER"]),
		checkIsBlockedMiddleware
	],
	async (req, res) => {
		try {
			const answer = await categoryService.toggleSubscription(
				req.user.id,
				req.params.id
			);
			return res.send(answer);
		} catch (error) {
			if (error.name === "SequelizeForeignKeyConstraintError") {
				return res
					.status(404)
					.send({ message: MESSAGE_UTIL.ERRORS.NOT_FOUND("category") });
			}
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/subscriptions",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(["USER"]),
		checkIsBlockedMiddleware
	],
	async (req, res) => {
		try {
			const answer = await categoryService.getSubscriptions(req.user.id);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
