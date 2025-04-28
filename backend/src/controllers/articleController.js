const { Router } = require("express");
const router = Router();
const { statusCodeMessage } = require("@utils");

const {
	verifyTokenMiddleware,
	checkRolesMiddleware
} = require("@middlewares/auth");
const articleService = require("@services/articleService");
const articleListService = require("@services/articleListService");
const { createMulterInstance } = require("@utils");
const {
	createArticleMiddleware,
	updateArticleMiddleware
} = require("@middlewares/article");
const handleValidationErrorsMiddleware = require("@middlewares/handleValidationErrorsMiddleware");

const uploadArticleImg = createMulterInstance("articles");

router.get("/my-list", [verifyTokenMiddleware("access")], async (req, res) => {
	try {
		const answer = await articleListService.getMyList(req.user, req.query);
		return res.send(answer);
	} catch (error) {
		const { status, message } = statusCodeMessage(error);
		return res.status(status).send({ message });
	}
});

router.get(
	"/reactions/:id",
	[verifyTokenMiddleware("access")],
	async (req, res) => {
		try {
			const answer = await articleService.getArticleReactions(req.params.id);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.put(
	"/reaction/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware(["USER"])],
	async (req, res) => {
		try {
			const answer = await articleService.setArticleReaction(
				req.user.id,
				req.params.id,
				req.body.reaction
			);
			return res.send(answer);
		} catch (error) {
			console.log("article reactions error", error);
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.get("/:id", [verifyTokenMiddleware("access")], async (req, res) => {
	try {
		const answer = await articleService.getArticle(req.params.id, req.user);
		return res.send(answer);
	} catch (error) {
		const { status, message } = statusCodeMessage(error);
		return res.status(status).send({ message });
	}
});

router.post(
	"/",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(["ADMIN"]),
		uploadArticleImg.single("img"),
		createArticleMiddleware,
		handleValidationErrorsMiddleware
	],
	async (req, res) => {
		try {
			const answer = await articleService.createArticle(req);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.patch(
	"/:id",
	[
		verifyTokenMiddleware("access"),
		checkRolesMiddleware(["ADMIN"]),
		uploadArticleImg.single("img"),
		updateArticleMiddleware,
		handleValidationErrorsMiddleware
	],
	async (req, res) => {
		try {
			const answer = await articleService.updateArticle(req);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

router.delete(
	"/:id",
	[verifyTokenMiddleware("access"), checkRolesMiddleware(["ADMIN"])],
	async (req, res) => {
		try {
			const answer = await articleService.deleteArticle(
				req.user.id,
				req.params.id
			);
			return res.send(answer);
		} catch (error) {
			const { status, message } = statusCodeMessage(error);
			return res.status(status).send({ message });
		}
	}
);

module.exports = router;
