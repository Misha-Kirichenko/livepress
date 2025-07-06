const { Router } = require("express");
const router = Router();
const { statusCodeMessage } = require("@utils");
const {
	verifyTokenMiddleware,
	checkIsBlockedMiddleware
} = require("@middlewares/auth");
const { authService } = require("@services/api/auth");

router.post("/login", async (req, res) => {
	try {
		const { login, password } = req.body;
		const answer = await authService.login(login, password);
		return res.send(answer);
	} catch (error) {
		const { status, message } = statusCodeMessage(error);
		return res.status(status).send({ message });
	}
});

router.get(
	"/refresh",
	[verifyTokenMiddleware("refresh"), checkIsBlockedMiddleware],
	async (req, res) => {
		try {
			const tokenPairs = await authService.refresh(req.user);
			return res.send(tokenPairs);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get(
	"/me",
	[verifyTokenMiddleware("access"), checkIsBlockedMiddleware],
	(req, res) => {
		try {
			return res.send(req.user);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
