const { Router } = require("express");
const router = Router();
const { statusCodeMessage } = require("@utils");
const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const { blockUserMiddleware } = require("@middlewares/admin");
const { handleValidationErrorsMiddleware } = require("@middlewares");
const adminService = require("@services/adminService");

router.patch(
	"/block/:nickName",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(["ADMIN"]),
		blockUserMiddleware,
		handleValidationErrorsMiddleware
	],
	async (req, res) => {
		try {
			const answer = await adminService.toggleUserBlock(
				req.params.nickName,
				req.body
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
